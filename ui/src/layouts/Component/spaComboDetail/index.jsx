import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { spaComboDetail } from '../../../data/spaComboDetail';
import './index.scss';
import { message } from 'antd';

const SpaComboDetail = () => {
  const { comboId } = useParams();
  const combo = spaComboDetail[comboId];
  const navigate = useNavigate();
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
  
  if (!combo) {
    return <div>Không tìm thấy dịch vụ spa</div>;
  }

  return (
    <div className="spa-combo-detail">
      <h1 className="spa-combo-detail__title">QUY TRÌNH DỊCH VỤ</h1>
      <p className="spa-combo-detail__subtitle">{combo.title} - {combo.description}</p>
      <div className="spa-combo-detail__steps">
        {combo.steps.map((step, index) => (
          <div key={index} className="spa-combo-detail__step" >
            <img src={step.image} alt={step.name} />
            <p className="spa-combo-detail__step-name">{step.name}</p>
            <p className="spa-combo-detail__step-price">{step.price}</p>
            <p className="spa-combo-detail__step-duration">{step.duration}</p>
          </div>
        ))}
      </div>
      <button className="spa-combo-detail__book-button" onClick={handleBookingClick}>ĐẶT LỊCH NGAY</button>
    </div>
  );
};

export default SpaComboDetail;