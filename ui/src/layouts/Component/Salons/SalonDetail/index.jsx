import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSalons } from '../../../../data/salonService';
import './index.scss';
import { message } from 'antd';

// Hàm helper để xử lý URL imgur
const getImgurDirectUrl = (url) => {
  if (!url) return null;
  
  const imgurRegex = /https?:\/\/(?:i\.)?imgur\.com\/(\w+)(?:\.\w+)?/;
  const match = url.match(imgurRegex);
  
  if (match && match[1]) {
    return `https://i.imgur.com/${match[1]}.jpg`;
  }
  return url;
};

const SalonDetail = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleBookingClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/booking');
    } else {
      message.info('Vui lòng đăng nhập để đặt lịch');
      navigate('/login', { state: { from: '/booking' } });
    }
  };

  useEffect(() => {
    const loadSalonDetail = async () => {
      try {
        setLoading(true);
        const response = await fetchSalons();
        
        if (response && response.code === 0) {
          const selectedSalon = response.result.find(s => 
            String(s.id) === String(id)
          );
          
          if (selectedSalon) {
            setSalon(selectedSalon);
          } else {
            setError('Không tìm thấy thông tin salon.');
          }
        } else {
          setError('Không thể tải thông tin salon.');
        }
      } catch (err) {
        console.error('Error loading salon detail:', err);
        setError('Có lỗi xảy ra khi tải thông tin salon.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSalonDetail();
    }
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!salon) return <div>Không tìm thấy thông tin salon.</div>;

  return (
    <div className="salon-detail">
      <h2>30Shine {salon.district}</h2>
      {salon.image && (
        <img 
          src={getImgurDirectUrl(salon.image)} 
          alt={`30Shine ${salon.district}`}
          className="salon-detail__image"
        />
      )}
      
      <div className="salon-info">
        <div className="info-item">
          <i className="fas fa-map-marker-alt"></i>
          <p>Địa chỉ: {salon.address}</p>
        </div>

        <div className="info-item">
          <i className="fas fa-clock"></i>
          <p>Trạng thái: 
            <span className={`status-badge ${salon.open ? 'open' : 'closed'}`}>
              {salon.open ? 'Đang mở cửa' : 'Đã đóng cửa'}
            </span>
          </p>
        </div>

        <div className="info-item">
          <i className="fas fa-phone"></i>
          <p>Hotline: {salon.hotline}</p>
        </div>

        <div className="info-item">
          <i className="fas fa-clock"></i>
          <p>Giờ mở cửa: 8:30 - 20:30</p>
        </div>
      </div>

      <div className="salon-facilities">
        <h3>Tiện ích salon</h3>
        <ul>
          <li>Máy lạnh</li>
          <li>Wifi miễn phí</li>
          <li>TV</li>
          <li>Nước uống miễn phí</li>
          <li>Chỗ để xe</li>
          <li>Phòng chờ</li>
        </ul>
      </div>

      <button className="salon-detail__book-button" onClick={handleBookingClick}>
        ĐẶT LỊCH NGAY
      </button>
    </div>
  );
};

export default SalonDetail;