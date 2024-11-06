import { Card, Col, Row, Statistic, Space, Tabs } from "antd"
import { useEffect, useState } from "react"
import { getAll } from "../services/bookingService";
import { getAll as getAllSalons } from "../services/salonService";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import NavLink from "../../../layouts/admin/components/link/navLink";

function Dashboard() {
    const [dailyRevenue, setDailyRevenue] = useState(0);
    const [bookingCount, setBookingCount] = useState(0); // State to hold today's booking count
    const [tomorrowBookingCount, setTomorrowBookingCount] = useState(0); // State to hold tomorrow's booking count
    const [pieData, setPieData] = useState([]);
    const [barData, setBarData] = useState([]); // State cho dữ liệu BarChart
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]; // Get tomorrow's date
    const [salons, setSalons] = useState([]);
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

    const fetchRevenue = async () => {
        try {
            const response = await getAll();
            console.log('Booking:', response.data.result);
            if (response.data.code === 0) {
                const totalRevenue = response.data.result
                    .filter(booking => booking.status === "SUCCESS" && booking.date === today) // Filter by status and today's date
                    .reduce((acc, booking) => acc + booking.price, 0); // Sum the prices
                setDailyRevenue(totalRevenue); // Set the total revenue
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchBookingCount = async () => {
        try {
            const response = await getAll();
            if (response.data.code === 0) {
                const countToday = response.data.result
                    .filter(booking => booking.status === "SUCCESS" && booking.date === today) // Filter for today's successful bookings
                    .length; // Count the number of successful bookings
                setBookingCount(countToday); // Set the booking count for today

                const countTomorrow = response.data.result
                    .filter(booking => booking.date === tomorrow) // Filter for tomorrow's bookings
                    .length; // Count the number of bookings for tomorrow
                setTomorrowBookingCount(countTomorrow); // Set the booking count for tomorrow
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchServiceCounts = async () => {
        try {
            const response = await getAll();
            if (response.data.code === 0) {
                const serviceCounts = {};
                
                // Duyệt qua từng booking
                response.data.result.forEach(booking => {
                    // Duyệt qua từng dịch vụ trong mỗi booking
                    booking.services.forEach(service => {
                        const serviceName = service.serviceName;
                        // Tăng số lượng đặt cho từng dịch vụ
                        serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
                    });
                });
                
                // Chuyển đổi thành mảng cho PieChart
                const pieData = Object.entries(serviceCounts).map(([name, value]) => ({ name, value }));
                setPieData(pieData); // Cập nhật dữ liệu cho PieChart
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchRevenueByDate = async () => {
        try {
            const response = await getAll();
            if (response.data.code === 0) {
                const revenueByDate = {};
                response.data.result.forEach(booking => {
                    if (booking.status === "SUCCESS") {
                        const bookingDate = booking.date; // Lấy ngày đặt
                        revenueByDate[bookingDate] = (revenueByDate[bookingDate] || 0) + booking.price; // Cộng dồn doanh thu theo ngày
                    }
                });
                // Chuyển đổi thành mảng chứa các object với date và revenue
                const barDataArray = Object.entries(revenueByDate).map(([date, revenue]) => ({ date, revenue }));
                setBarData(barDataArray); // Cập nhật dữ liệu cho BarChart
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchSalons = async () => {
        try {
            const response = await getAllSalons();
            if (response.data.code === 0) {
                setSalons(response.data.result); // Set the list of salons
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const tabs = salons.map((salon, index) => ({
        key: String(index + 1),
        label: `${salon.address} (${salon.district})`, // Assuming each salon has a 'name' property
        children: <StatisticContent salonId={salon.id} />, // Pass salon ID to the content component
    }));

    useEffect(() => {
        fetchRevenue();
        fetchBookingCount();
        fetchServiceCounts();
        fetchRevenueByDate();
        fetchSalons()
    }, []);


    return (
        <>
            <NavLink currentPage="Thống kê" />
            <Tabs defaultActiveKey="1" items={tabs} />
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Row gutter={16}>
                    <Col span={5}>
                        <Card bordered={false}>
                            <Statistic
                                title={`Tổng doanh thu hôm nay (${today})`}
                                value={dailyRevenue}
                                valueStyle={{
                                    color: '#3f8600',
                                }}
                                suffix="VND"
                            />
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card bordered={false}>
                            <Statistic
                                title={`Tổng lịch đặt hôm nay (${today})`}
                                value={bookingCount}
                                valueStyle={{
                                    color: '#3f8600',
                                }}
                            />
                        </Card>
                    </Col>
                    <Col span={5}>
                        <Card bordered={false}>
                            <Statistic
                                title={`Tổng lịch đặt ngày mai (${tomorrow})`}
                                value={tomorrowBookingCount}
                                valueStyle={{
                                    color: '#3f8600',
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={7}>
                        <Card bordered={false}>
                            <PieChart width={400} height={300}>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#15397F" label>
                                    {pieData.map((item, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        </Card>
                    </Col>
                    
                    <Col span={17}>
                        <Card bordered={false}>
                            <BarChart width={1000} height={300} data={barData}>
                                <CartesianGrid strokeDasharray="3 1" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#8884d8" />
                            </BarChart>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </>
    );
}

// Hàm để hiển thị nội dung thống kê cho từng salon
const StatisticContent = ({ salonId }) => {
    // Thực hiện các truy vấn và logic để lấy dữ liệu thống kê cho salonId
    return (
        <div>
            <h3>Thống kê cho Salon {salonId}</h3>
            {/* Các thành phần thống kê khác */}
        </div>
    );
};

export default Dashboard;