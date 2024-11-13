import { Card, Col, Row, Statistic, Space, Tabs } from "antd"
import { useEffect, useState } from "react"
import { getAll, getAllByManager } from "../services/bookingService";
import { getAll as getAllSalons } from "../services/salonService";
import { 
    Bar, BarChart, CartesianGrid, Cell, Label, Legend, 
    Pie, PieChart, Rectangle, Tooltip, XAxis, YAxis, LabelList,
    ResponsiveContainer 
} from "recharts";
import NavLink from "../../../layouts/admin/components/link/navLink";
import { getDashboardByAdmin, getDashboardByManager } from "../services/dashboard";
import { 
    DollarCircleOutlined, 
    CalendarOutlined, 
    ShopOutlined, 
    TeamOutlined 
} from '@ant-design/icons';
import { Avatar, Table } from 'antd';
import { StarFilled } from '@ant-design/icons';

// Thêm hàm xử lý link ảnh
const getImgurImage = (url) => {
    if (!url) return "https://via.placeholder.com/150"; // Ảnh mặc định nếu không có url
    // Kiểm tra nếu url đã có đuôi
    if (url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg')) {
        return url;
    }
    // Thêm đuôi .jpg vào link imgur
    return `${url}.jpg`;
};

function Dashboard() {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [bookingCount, setBookingCount] = useState(0); // State to hold today's booking count
    const [pieData, setPieData] = useState([]);
    const [barData, setBarData] = useState([]); // State cho dữ liệu BarChart
    const [totalSalonCount, setTotalSalonCount] = useState(0)
    const [totalStaffCount, setTotalStaffCount] = useState(0)
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF5733", "#C70039", "#900C3F", "#581845"];

    // Thêm state để kiểm tra dữ liệu đã load xong chưa
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Thêm state cho top 5 staff
    const [topStaffs, setTopStaffs] = useState([]);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        console.log('Current role from localStorage:', role);
        
        if (role) {
            setUserRole(role);
            console.log('Set user role:', role);
        } else {
            console.warn('No role found in localStorage');
        }
    }, []);

    // useEffect để gọi các hàm fetch sau khi userRole được thiết lập
    useEffect(() => {
        const fetchData = async () => {
            if (userRole) {
                try {
                    await Promise.all([
                        fetchRevenueOfAllTime(),
                        fetchBookingCount(),
                        fetchServiceCounts(),
                        fetchTotalSalon(),
                        fetchTotalStaff(),
                        fetchRevenueByMonth(),
                        fetchTopStaffs()
                    ]);
                    setIsDataLoaded(true); // Đánh dấu dữ liệu đã được tải
                } catch (error) {
                    console.error('Error loading data:', error);
                    setIsDataLoaded(false); // Đánh dấu dữ liệu chưa được tải nếu có lỗi
                }
            }
        };

        fetchData(); // Gọi hàm fetchData
    }, [userRole]); // Theo dõi sự thay đổi của userRole

    const isAdmin = userRole === 'admin' || userRole === 'ADMIN';

    const fetchRevenueOfAllTime = async () => {
        try {
            const response = await (isAdmin ? getDashboardByAdmin() : getDashboardByManager());
            console.log('fetchRevenueOfAllTime:', response.data.result.totalSales, isAdmin);
            if (response.data.code === 200) {
                const totalRevenue = response.data.result.totalSales;
                setTotalRevenue(totalRevenue); // Set the total revenue
            }
        } catch (error) {
            console.warn(error);
        }
    }

    const fetchBookingCount = async () => {
        try {
            const response = await (isAdmin ? getDashboardByAdmin() : getDashboardByManager());
            if (response.data.code === 200) {
                const count = response.data.result.totalBookings
                setBookingCount(count);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchServiceCounts = async () => {
        try {
            const response = await (isAdmin ? getAll() : getAllByManager());
            if (response.data.code === 0) {
                const serviceCounts = {};
                response.data.result.forEach(booking => {
                    booking.services.forEach(service => {
                        const serviceName = service.serviceName;
                        serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
                    });
                });
                const pieData = Object.entries(serviceCounts).map(([name, value]) => ({ name, value }));
                setPieData(pieData);
                console.log(pieData)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchRevenueByMonth = async () => {
        try {
            const response = await (isAdmin ? getDashboardByAdmin() : getDashboardByManager());
            if (response.data.code === 200) {
                const revenueSalesResponses = response.data.result.revenueSalesResponses;
                const barDataArray = revenueSalesResponses.map(item => ({
                    date: `${item.year}-${item.month < 10 ? '0' + item.month : item.month}`,
                    revenue: item.sales
                }));
                setBarData(barDataArray);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTotalSalon = async () => {
        try {
            const response = await getDashboardByAdmin();
            if (response.data.code === 200) {
                const totalSalons = response.data.result.totalSalons;
                setTotalSalonCount(totalSalons);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchTotalStaff = async () => {
        try {
            const response = await (isAdmin ? getDashboardByAdmin() : getDashboardByManager());
            if (response.data.code === 200) {
                const totalStaffs = response.data.result.totalStaffs;
                setTotalStaffCount(totalStaffs);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchTopStaffs = async () => {
        try {
            const response = await (isAdmin ? getDashboardByAdmin() : getDashboardByManager());
            if (response.data.code === 200 && response.data.result.topFiveStaffByRating) {
                setTopStaffs(response.data.result.topFiveStaffByRating);
            }
        } catch (error) {
            console.log('Error fetching top staffs:', error);
        }
    };

    // Thêm vào phần return, sau các Row hiện tại
    return (
        <>
            <NavLink currentPage="Thống kê" />
            <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
                {/* Stats Cards */}
                <Row gutter={[16, 16]}>
                    <Col span={24} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {/* Card Tổng doanh thu */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <Card
                                bordered={false}
                                style={{
                                    background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                                bodyStyle={{ padding: '20px' }}
                            >
                                <div style={{ color: 'white' }}>
                                    <div style={{ 
                                        fontSize: '14px', 
                                        opacity: 0.85,
                                        marginBottom: '12px'
                                    }}>
                                        Tổng doanh thu
                                    </div>
                                    <div style={{ 
                                        fontSize: '24px', 
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <DollarCircleOutlined style={{ fontSize: '24px' }}/>
                                        <span>{totalRevenue.toLocaleString()} VND</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Card tổng Lịch đặt */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <Card
                                bordered={false}
                                style={{
                                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                                bodyStyle={{ padding: '20px' }}
                            >
                                <div style={{ color: 'white' }}>
                                    <div style={{ 
                                        fontSize: '14px', 
                                        opacity: 0.85,
                                        marginBottom: '12px'
                                    }}>
                                        Tổng số lịch đặt
                                    </div>
                                    <div style={{ 
                                        fontSize: '24px', 
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <CalendarOutlined style={{ fontSize: '24px' }}/>
                                        <span>{bookingCount}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {isAdmin && (
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <Card
                                    bordered={false}
                                    style={{
                                        background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    bodyStyle={{ padding: '20px' }}
                                >
                                    <div style={{ color: 'white' }}>
                                        <div style={{ 
                                            fontSize: '14px', 
                                            opacity: 0.85,
                                            marginBottom: '12px'
                                        }}>
                                            Số lượng salon
                                        </div>
                                        <div style={{ 
                                            fontSize: '24px', 
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <ShopOutlined style={{ fontSize: '24px' }}/>
                                            <span>{totalSalonCount}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* Card Tổng số nhân viên */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <Card
                                bordered={false}
                                style={{
                                    background: 'linear-gradient(135deg, #f5222d 0%, #cf1322 100%)',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                                bodyStyle={{ padding: '20px' }}
                            >
                                <div style={{ color: 'white' }}>
                                    <div style={{ 
                                        fontSize: '14px', 
                                        opacity: 0.85,
                                        marginBottom: '12px'
                                    }}>
                                        Tổng số nhân viên
                                    </div>
                                    <div style={{ 
                                        fontSize: '24px', 
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <TeamOutlined style={{ fontSize: '24px' }}/>
                                        <span>{totalStaffCount}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>

                {/* Charts Row */}
                <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                    <Col xs={24} lg={8}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: '15px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                            title={
                                <div style={{ 
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#1677ff',
                                    textAlign: 'center',
                                    margin: '12px 0'
                                }}>
                                    Thống kê dịch vụ được đặt
                                </div>
                            }
                        >
                            <div style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                                <PieChart width={300} height={300}>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={16}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: '15px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                            title={
                                <div style={{ 
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#1677ff',
                                    textAlign: 'center',
                                    margin: '12px 0'
                                }}>
                                    Thống kê doanh thu theo tháng
                                </div>
                            }
                        >
                            <div style={{ height: 300, width: '100%' }}>
                                <ResponsiveContainer>
                                    <BarChart 
                                        data={barData}
                                        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                                    >
                                        <CartesianGrid 
                                            strokeDasharray="3 3" 
                                            stroke="#f0f0f0"
                                        />
                                        <XAxis 
                                            dataKey="date"
                                            tick={{ fill: '#666', fontSize: 12 }}
                                            tickFormatter={(value) => {
                                                const [year, month] = value.split('-');
                                                return `${month} - ${year}`;
                                            }}
                                            axisLine={{ stroke: '#d9d9d9' }}
                                        />
                                        <YAxis
                                            tick={{ fill: '#666', fontSize: 12 }}
                                            tickFormatter={(value) => `${value.toLocaleString()} VND`}
                                            axisLine={{ stroke: '#d9d9d9' }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                                            contentStyle={{
                                                background: '#fff',
                                                border: '1px solid #d9d9d9',
                                                borderRadius: '6px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                            }}
                                            formatter={(value) => [`${value.toLocaleString()} VND`, 'Doanh thu']}
                                            labelFormatter={(label) => {
                                                const [year, month] = label.split('-');
                                                return `Tháng ${month}/${year}`;
                                            }}
                                        />
                                        <Bar 
                                            dataKey="revenue" 
                                            fill="#1890ff"
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={60}
                                        >
                                            {barData.map((entry, index) => {
                                                const currentDate = new Date();
                                                const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                                                const isCurrentMonth = entry.date === currentMonth;

                                                return (
                                                    <Cell 
                                                        key={`cell-${index}`}
                                                        fill={isCurrentMonth ? '#1890ff' : '#bae7ff'}
                                                    />
                                                );
                                            })}
                                            <LabelList
                                                dataKey="revenue"
                                                position="top"
                                                formatter={(value) => `${value.toLocaleString()}`}
                                                style={{
                                                    fill: '#666',
                                                    fontSize: 12
                                                }}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Top Staffs Table */}
                <Row style={{ marginTop: '24px' }}>
                    <Col span={24}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: '15px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                            title={
                                <div style={{ 
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#1677ff',
                                    textAlign: 'center',
                                    margin: '12px 0'
                                }}>
                                    Top 5 Nhân viên được đánh giá cao nhất.
                                </div>
                            }
                        >
                            <Table 
                                columns={columns} 
                                dataSource={topStaffs}
                                rowKey="code"
                                pagination={false}
                                loading={!isDataLoaded}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

// Hàm để hiển thị nội dung thống kê cho từng salon
// const StatisticContent = ({ salonId }) => {
//     // Thực hiện các truy vấn và logic để lấy dữ liệu thống kê cho salonId
//     return (
//         <div>
//             <h3>Thống kê cho Salon {salonId}</h3>
//         </div>
//     );
// };

// Định nghĩa columns cho table
const columns = [
    {
        title: 'Nhân viên',
        key: 'staff',
        render: (text, record) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar 
                    src={getImgurImage(record.image)} 
                    size={40}
                    style={{ 
                        border: '2px solid #f0f0f0',
                        objectFit: 'cover'
                    }}
                />
                <div>
                    <div style={{ 
                        fontWeight: 'bold',
                        fontSize: '14px' 
                    }}>
                        {`${record.firstName} ${record.lastName}`}
                    </div>
                    <div style={{ 
                        fontSize: '12px', 
                        color: '#666' 
                    }}>
                        {record.code}
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: 'Đánh giá',
        key: 'rating',
        render: (text, record) => (
            <div style={{ color: '#faad14' }}>
                <StarFilled /> {record.ovrRating.toFixed(1)}
            </div>
        ),
    },
    {
        title: 'Chi nhánh',
        key: 'salon',
        render: (text, record) => (
            <div>
                {record.salons ? record.salons.address : 'Chưa phân công'}
            </div>
        ),
    }
];

export default Dashboard;