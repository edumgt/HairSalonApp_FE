import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, message, Tag } from 'antd';
import { CalendarOutlined, ScissorOutlined, DollarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import './index.scss';

const { Title } = Typography;

function ShineHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      />
    </div>
  );
}

export default ShineHistory;
