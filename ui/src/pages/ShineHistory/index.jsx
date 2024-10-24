import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, message, Tag, Modal, Rate, Input, Button, Space } from 'antd';
import { CalendarOutlined, ScissorOutlined, DollarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.scss';

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

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingHistory();
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
      title: 'Xác nhận hủy lịch',
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
    // Xử lý logic cập nhật booking
    message.success('Đã cập nhật đặt lịch');
    setIsModalVisible(false);
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
      render: (text, record) => (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {text} {record.slot.timeStart}
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

  const renderBookingDetails = () => {
    if (!selectedBooking) return null;

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
      </div>
    );
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
    </div>
  );
}

export default ShineHistory;
