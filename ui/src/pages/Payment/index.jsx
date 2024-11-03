import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Card, Descriptions, Button, message, Row, Col, Divider, Spin } from 'antd';
import { DollarOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, ScissorOutlined } from '@ant-design/icons';
import axios from 'axios';
import './index.scss';

const { Title } = Typography;

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingInfo = location.state?.bookingInfo;
  const [paymentId, setPaymentId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (!bookingInfo || !bookingInfo.id) {
        message.error('Không tìm thấy thông tin đặt lịch');
        navigate('/');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Vui lòng đăng nhập để xem thông tin thanh toán');
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/v1/booking/payment/${bookingInfo.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.code === 0 && response.data.result?.id) {
          setPaymentId(response.data.result.id);
          console.log("Payment ID:", response.data.result.id);
        } else {
          throw new Error('Không tìm thấy thông tin thanh toán cho đặt lịch này');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin thanh toán:', error);
        message.error(error.message || 'Không thể lấy thông tin thanh toán. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [bookingInfo, navigate]);

  const handlePaymentConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để thanh toán');
        navigate('/login');
        return;
      }

      if (!paymentId) {
        throw new Error('Không tìm thấy thông tin thanh toán');
      }

      const response = await axios.post(`http://localhost:8080/api/v1/payment/${paymentId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.code === 0) {
        message.success('Thanh toán thành công. Cảm ơn quý khách!');
        setTimeout(() => {
          navigate('/shine-history');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Thanh toán thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      message.error(error.message || 'Không thể thanh toán. Vui lòng thử lại sau.');
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!bookingInfo) {
    return <div>Không tìm thấy thông tin đặt lịch</div>;
  }

  return (
    <div className="payment-container">
      <Title level={2}>Thanh toán đặt lịch</Title>
      {paymentId && <p>Payment ID: {paymentId}</p>}
      <Card className="payment-card">
        <Row gutter={24}>
          <Col span={24} md={12}>
            <Descriptions title="Thông tin đặt lịch" column={1} bordered>
              <Descriptions.Item label={<><CalendarOutlined /> Ngày</>}>{bookingInfo.date}</Descriptions.Item>
              <Descriptions.Item label={<><ClockCircleOutlined /> Thời gian</>}>{bookingInfo.slot.timeStart}</Descriptions.Item>
              <Descriptions.Item label={<><ScissorOutlined /> Dịch vụ</>}>
                {bookingInfo.services.map(s => s.serviceName).join(', ')}
              </Descriptions.Item>
              <Descriptions.Item label={<><UserOutlined /> Stylist</>}>
                {bookingInfo.stylistId && typeof bookingInfo.stylistId === 'object'
                  ? `${bookingInfo.stylistId.firstName || ''} ${bookingInfo.stylistId.lastName || ''}`
                  : bookingInfo.stylistId || 'Không có thông tin'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={24} md={12}>
            <Card className="payment-summary">
              <Title level={4}>Tổng quan thanh toán</Title>
              <Divider />
              <p><strong>Mã đặt lịch:</strong> {bookingInfo.id}</p>
              {paymentId && <p><strong>Mã thanh toán:</strong> {paymentId}</p>}
              <p><strong>Tổng giá:</strong> <span className="total-price">
                {bookingInfo.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span></p>
              <p><strong>Trạng thái:</strong> {bookingInfo.status}</p>
              <Divider />
              <p><strong>Hình thức thanh toán:</strong> Tiền mặt</p>
            </Card>
          </Col>
        </Row>
        <Button type="primary" icon={<DollarOutlined />} onClick={handlePaymentConfirm} className="payment-button">
          Xác nhận thanh toán tiền mặt
        </Button>
      </Card>
    </div>
  );
}

export default Payment;
