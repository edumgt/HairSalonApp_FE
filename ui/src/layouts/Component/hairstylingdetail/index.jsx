import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hairStylingDetail } from '../../../data/hairStylingDetail';
import { message } from 'antd';
import './index.scss';

const HairStylingDetail = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  console.log("Current serviceId:", serviceId);
  console.log("Available services:", Object.keys(hairStylingDetail));
  console.log("Service data:", hairStylingDetail[serviceId]);

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


  const service = hairStylingDetail[serviceId];

  if (!service) {
    return <div>Không tìm thấy dịch vụ (ID: {serviceId})</div>;  
  }

  return (
    <div className="hair-styling-detail">
      <h2 className="hair-styling-detail__title">{service.title}</h2>
      <p className="hair-styling-detail__description">{service.description}</p>
      <div className="hair-styling-detail__service-price"></div>
      <div className="hair-styling-detail__options">
        {service.steps.map((step, index) => (
          <div key={index} className="hair-styling-detail__option">
            <img src={step.image} alt={step.name} className="hair-styling-detail__image" />
            <div className="hair-styling-detail__info">
              <div className="hair-styling-detail__name">{step.name}</div>
              <div className="hair-styling-detail__price">{step.price}</div>
            </div>
          </div>
        ))}
      </div>
    
      <div className="hair-styling-detail__privilege">
        <h3 className="hair-styling-detail__privilege-title">ĐẶC QUYỀN</h3>
        <p className="hair-styling-detail__privilege-description">Hỗ trợ làm lại kiểu tóc mới nếu anh chưa ưng ý.</p>
        <div className="hair-styling-detail__privilege-card">
          <h4 className="hair-styling-detail__privilege-card-title">THẺ CHĂM SÓC KHÁCH HÀNG UỐN - NHUỘM - DƯỠNG</h4>
          <p className="hair-styling-detail__privilege-card-subtitle">QUYỀN LỢI VIP CỦA KHÁCH HÀNG 30SHINE</p>
          <ul className="hair-styling-detail__privilege-list">
            <li>Nếu chưa ưng ý về kiểu tóc Uốn/ Nhuộm, chúng em sẵn sàng hỗ trợ làm lại miễn phí theo cam kết của 30Shine Care</li>
            <li>Thời hạn: trong 7 ngày tính từ ngày anh Uốn/ Nhuộm</li>
          </ul>
        </div>
      </div>
      <button className="hair-styling-detail__book-button" onClick={handleBookingClick}>ĐẶT LỊCH NGAY</button>
    </div>
    
  );
};

export default HairStylingDetail;