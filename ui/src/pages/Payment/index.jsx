import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Typography, Card, Descriptions, Button, message, Row, Col, Divider } from 'antd';
import { DollarOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, ScissorOutlined } from '@ant-design/icons';
import './index.scss';

const { Title } = Typography;

function Payment() {
  const { bookingId } = useParams();
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <div>Không tìm thấy thông tin đặt lịch</div>;
  }

  const handlePaymentConfirm = () => {
    // Xử lý logic xác nhận thanh toán ở đây
    message.success('Thanh toán thành công!');
  };

  return (
    <div className="payment-container">
      <Title level={2}>Thanh toán đặt lịch</Title>
      <Card className="payment-card">
        <Row gutter={24}>
          <Col span={24} md={12}>
            <Descriptions title="Thông tin đặt lịch" column={1} bordered>
              <Descriptions.Item label={<><CalendarOutlined /> Ngày</>}>{booking.date}</Descriptions.Item>
              <Descriptions.Item label={<><ClockCircleOutlined /> Thời gian</>}>{booking.slot.timeStart}</Descriptions.Item>
              <Descriptions.Item label={<><ScissorOutlined /> Dịch vụ</>}>{booking.services.map(s => s.serviceName).join(', ')}</Descriptions.Item>
              <Descriptions.Item label={<><UserOutlined /> Stylist</>}>{`${booking.stylistId.firstName} ${booking.stylistId.lastName}`}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={24} md={12}>
            <Card className="payment-summary">
              <Title level={4}>Tổng quan thanh toán</Title>
              <Divider />
              <p><strong>Mã đặt lịch:</strong> {booking.id}</p>
              <p><strong>Tổng giá:</strong> <span className="total-price">{booking.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
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
