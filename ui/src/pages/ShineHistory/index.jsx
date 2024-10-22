import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, message } from 'antd';
import { CalendarOutlined, ScissorOutlined, DollarOutlined } from '@ant-design/icons';
import './index.scss';

const { Title } = Typography;

function ShineHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShineHistory();
  }, []);

  const fetchShineHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để xem lịch sử');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8080/api/v1/shine-history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shine history');
      }

      const data = await response.json();
      if (data.result) {
        setHistory(data.result);
      } else {
        throw new Error('Shine history data not found');
      }
    } catch (error) {
      console.error('Error fetching shine history:', error);
      message.error('Không thể tải lịch sử tỏa sáng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
      render: (text) => (
        <span>
          <ScissorOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: 'Giá',
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
      dataIndex: 'stylist',
      key: 'stylist',
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="shine-history-container">
      <Title level={2}>Lịch Sử Tỏa Sáng</Title>
      <Table 
        dataSource={history} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default ShineHistory;

