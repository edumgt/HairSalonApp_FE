import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, message, Tag, Modal, Rate, Input, Button, Space, DatePicker, Select, ConfigProvider } from 'antd';
import { CalendarOutlined, ScissorOutlined, DollarOutlined, UserOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import moment from 'moment';
import 'moment/locale/vi';
import vi_VN from 'antd/lib/locale/vi_VN';

// Đặt locale cho moment
moment.locale('vi');

const { Title } = Typography;
const { TextArea } = Input;

const { confirm } = Modal;

function ShineHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newSlotId, setNewSlotId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [originalDate, setOriginalDate] = useState(null);
  const [originalSlotId, setOriginalSlotId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingHistory();
    fetchSlots();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để xem lịch sử đặt lịch');
        setLoading(false);
        return;
      }

      const response = await axios.patch('http://localhost:8080/api/v1/booking', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.result) {
        setBookings(response.data.result);
      } else {
        throw new Error('Dữ liệu đặt lịch không tìm thấy');
      }
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử đặt lịch:', error);
      message.error('Không thể tải lịch sử đặt lịch. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    confirm({
      title: 'Xác nhận hy lịch',
      content: 'Anh thật sự muốn hủy lịch à :<',
      okText: 'Đúng vậy',
      cancelText: 'Không, tôi đổi ý rồi',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            message.error('Vui lòng đăng nhập để hủy lịch');
            return;
          }

          const response = await axios.delete(`http://localhost:8080/api/v1/booking/${selectedBooking.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.status === 200 || response.status === 204) {
            message.success('Đã hủy lịch thành công. Hẹn gặp lại anh nhé! 😊');
            setIsModalVisible(false);
            fetchBookingHistory(); // Cập nhật lại danh sách đặt lịch
          } else {
            throw new Error(response.data?.message || 'Hủy lịch thất bại');
          }
        } catch (error) {
          console.error('Lỗi khi hủy lịch:', error);
          message.error(error.message || 'Không thể hủy lịch. Vui lòng thử lại sau.');
        }
      },
      onCancel() {
        console.log('Hủy bỏ việc xóa lịch');
      },
    });
  };

  const handleUpdate = () => {
    if (selectedBooking) {
      setNewDate(selectedBooking.date); // Giả sử selectedBooking.date là string dạng 'YYYY-MM-DD'
      setNewSlotId(selectedBooking.slot.id);
      setIsRescheduleModalVisible(true);
    }
  };

  const handlePayment = () => {
    if (selectedBooking.status === "SUCCESS") {
      // Chuyển hướng đến trang thanh toán với thông tin booking
      navigate(`/payment/${selectedBooking.id}`, { state: { booking: selectedBooking } });
    } else {
      message.error('Chỉ có thể thanh toán cho các đặt lịch có trạng thái SUCCESS');
    }
    setIsModalVisible(false);
  };

  const handleCancelPeriodic = () => {
    confirm({
      title: 'Xác nhận hủy đặt lịch định kỳ',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy đặt lịch định kỳ này không?',
      okText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            message.error('Vui lòng đăng nhập để thực hiện thao tác này');
            return;
          }

          const response = await axios.put(`http://localhost:8080/api/v1/booking/${selectedBooking.id}`, 
            { period: 0 },
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );

          if (response.status === 200) {
            message.success('Đã hủy đặt lịch định kỳ thành công');
            setIsModalVisible(false);
            fetchBookingHistory(); // Cập nhật lại danh sách đặt lịch
          } else {
            throw new Error(response.data?.message || 'Hủy đặt lịch định kỳ thất bại');
          }
        } catch (error) {
          console.error('Lỗi khi hủy đặt lịch định kỳ:', error);
          message.error(error.message || 'Không thể hủy đặt lịch định kỳ. Vui lòng thử lại sau.');
        }
      },
    });
  };

  const renderBookingDetails = () => {
    if (!selectedBooking) return null;

    const renderPeriodInfo = () => {
      if (selectedBooking.period > 0) {
        return `Có (${selectedBooking.period} tuần/lần)`;
      }
      return 'Không';
    };

    return (
      <div className="booking-details">
        <h3>Chi tiết đặt lịch</h3>
        <p><strong>Mã đặt lịch:</strong> {selectedBooking.id}</p>
        <p><strong>Ngày:</strong> {selectedBooking.date}</p>
        <p><strong>Dịch vụ:</strong> {selectedBooking.services.map(s => s.serviceName).join(', ')}</p>
        <p><strong>Tổng giá:</strong> {selectedBooking.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
        <p><strong>Stylist:</strong> {`${selectedBooking.stylistId.firstName} ${selectedBooking.stylistId.lastName}`}</p>
        <p><strong>Thời gian:</strong> {selectedBooking.slot.timeStart}</p>
        <p><strong>Trạng thái:</strong> {selectedBooking.status}</p>
        <p><strong>Đặt lịch định kỳ:</strong> {renderPeriodInfo()}</p>
        {selectedBooking.period > 0 && (
          <Button onClick={handleCancelPeriodic} type="primary" danger>
            Hủy định kỳ
          </Button>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: 'Mã đặt lịch',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {moment(text).format('DD-MM-YYYY')}
        </span>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'services',
      key: 'services',
      render: (services) => (
        <>
          {services.map((service) => (
            <Tag key={service.serviceId} color="blue">
              <ScissorOutlined style={{ marginRight: 4 }} />
              {service.serviceName}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Tổng giá',
      dataIndex: 'price',
      key: 'price',
      render: (text) => (
        <span>
          <DollarOutlined style={{ marginRight: 8 }} />
          {text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </span>
      ),
    },
    {
      title: 'Stylist',
      dataIndex: ['stylistId', 'firstName'],
      key: 'stylist',
      render: (firstName, record) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {`${record.stylistId.firstName} ${record.stylistId.lastName}`}
        </span>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: ['slot', 'timeStart'],
      key: 'time',
      render: (timeStart) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          {timeStart}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        switch (status) {
          case 'RECEIVED':
            color = 'green';
            break;
          // Thêm các trường hợp khác nếu cần
        }
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    }
  ];

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để xem khung giờ');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/v1/slot', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.code === 200 && Array.isArray(response.data.result)) {
        setSlots(response.data.result);
      } else {
        throw new Error('Dữ liệu khung giờ không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khung giờ:', error);
      message.error('Không thể tải danh sách khung giờ. Vui lòng thử lại sau.');
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newSlotId) {
      message.error('Vui lòng nhập ngày và chọn khung giờ mới');
      return;
    }

    // Kiểm tra định dạng ngày
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      message.error('Vui lòng nhập ngày theo định dạng YYYY-MM-DD');
      return;
    }

    // Kiểm tra nếu thời gian mới là trong quá khứ
    const now = moment();
    const newBookingTime = moment(`${newDate} ${slots.find(slot => slot.id === newSlotId)?.timeStart}`, 'YYYY-MM-DD HH:mm:ss');

    if (newBookingTime.isBefore(now)) {
      message.error('Không thể dời lịch về thời điểm trong quá khứ');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để dời lịch');
        return;
      }

      const response = await axios.put('http://localhost:8080/api/v1/booking', {
        bookingId: selectedBooking.id,
        slotId: newSlotId,
        date: newDate
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.code === 0) {
        message.success(response.data.message);
        setIsRescheduleModalVisible(false);
        setIsModalVisible(false); // Đóng modal chi tiết đặt lịch
        fetchBookingHistory(); // Cập nhật lại danh sách đặt lịch
      } else {
        throw new Error(response.data.message || 'Dời lịch thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi dời lịch:', error);
      message.error(error.message || 'Không thể dời lịch. Vui lòng thử lại sau.');
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="shine-history-container">
      <Title level={2}>Lịch Sử Đặt Lịch</Title>
      <Table 
        dataSource={bookings} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => showModal(record),
        })}
      />
      <Modal
        title="Chi tiết đặt lịch"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="delete" onClick={handleDelete} danger>
            Hủy lịch
          </Button>,
          <Button key="update" onClick={handleUpdate}>
            Cập nhật
          </Button>,
          <Button key="payment" type="primary" onClick={handlePayment}>
            Thanh toán
          </Button>,
        ]}
        width={700}
      >
        {renderBookingDetails()}
        <div className="rating-feedback">
          <h4>Đánh giá dịch vụ</h4>
          <Rate value={rating} onChange={setRating} />
          <TextArea
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Nhập phản hồi của bạn..."
          />
        </div>
      </Modal>
      <Modal
        title="Dời lịch"
        visible={isRescheduleModalVisible}
        onOk={handleReschedule}
        onCancel={() => setIsRescheduleModalVisible(false)}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            style={{ width: '100%' }}
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            placeholder="Nhập ngày mới (YYYY-MM-DD)"
          />
          <Select
            style={{ width: '100%' }}
            value={newSlotId}
            onChange={(value) => setNewSlotId(value)}
            placeholder="Chọn khung giờ mới"
          >
            {slots.map(slot => (
              <Select.Option key={slot.id} value={slot.id}>
                {slot.timeStart.slice(0, 5)}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </Modal>
    </div>
  );
}

export default ShineHistory;
