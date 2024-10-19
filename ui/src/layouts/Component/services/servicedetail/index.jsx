import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { serviceDetails } from '../../../../data/serviceDetails';
import { message } from 'antd';
import './index.scss';

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const service = serviceDetails[serviceId];

  const handleBookingClick = () => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const token = localStorage.getItem('token');
    if (token) {
      // Nếu đã đăng nhập, chuyển hướng đến trang đặt lịch
      navigate('/booking');
    } else {
      // Nếu chưa đăng nhập, hiển thị thông báo và chuyển hướng đến trang đăng nhập
      message.info('Vui lòng đăng nhập để đặt lịch');
      navigate('/login', { state: { from: '/booking' } }); // Lưu trang đích sau khi đăng nhập
    }
  };
  

  if (!service) {
    return <div>Không tìm thấy dịch vụ</div>;
  }

  return (
    <div className="service-detail">
      <h1 className="service-detail__title">QUY TRÌNH DỊCH VỤ</h1>
      <p className="service-detail__subtitle">{service.title} - {service.description}</p>
      <div className="service-detail__steps">
        {service.steps.map((step, index) => (
          <div key={index} className="service-detail__step">
            <img src={step.image} alt={step.name} />
            <p>{step.name}</p>
          </div>
        ))}
      </div>
      <button className="service-detail__book-button" onClick={handleBookingClick}>ĐẶT LỊCH NGAY</button>
    </div>
  );
};

export default ServiceDetail;