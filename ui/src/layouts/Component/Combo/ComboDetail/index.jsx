import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCombos } from '../../../../data/comboservice';
import './index.scss';

const ComboDetail = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { comboId } = useParams();
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    setUserRole(storedUserRole || '');
  }, []);

  useEffect(() => {
    const loadComboDetail = async () => {
      try {
        setLoading(true);
        const response = await fetchCombos();
        console.log('Fetched combos:', response); // Để debug

        if (response.code === 200 && Array.isArray(response.result)) {
          const selectedCombo = response.result.find(c => c.id === parseInt(comboId));
          console.log('Selected combo:', selectedCombo); // Để debug

          if (selectedCombo) {
            setCombo(selectedCombo);
          } else {
            setError('Không tìm thấy thông tin combo.');
          }
        } else {
          setError('Dữ liệu combo không hợp lệ.');
        }
      } catch (err) {
        console.error('Error loading combo detail:', err);
        setError('Có lỗi xảy ra khi tải thông tin combo. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadComboDetail();
  }, [comboId]);

  if (loading) return <div className="combo-detail">Đang tải...</div>;
  if (error) return <div className="combo-detail">{error}</div>;
  if (!combo) return <div className="combo-detail">Không tìm thấy thông tin combo.</div>;

  const getImgurDirectUrl = (url) => {
    if (!url) return '/fallback-image.jpg';
    const imgurRegex = /https?:\/\/(?:i\.)?imgur\.com\/(\w+)(?:\.\w+)?/;
    const match = url.match(imgurRegex);
    return match && match[1] ? `https://i.imgur.com/${match[1]}.jpg` : url;
  };

  const handleBookingClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.info('Vui lòng đăng nhập để đặt lịch');
      navigate('/login', { state: { from: '/booking' } });
      return;
    }

    if (userRole && userRole !== 'MEMBER') {
      message.error('Chỉ thành viên mới có thể đặt lịch');
      return;
    }

    navigate('/booking');
  };

  const totalDuration = combo.services.reduce((total, service) => total + parseInt(service.duration), 0);

  return (
    <div className="combo-detail">
      <h2>{combo.name}</h2>
      <div className="combo-images">
        {combo.services.map((service, index) => (
          <img key={index} src={getImgurDirectUrl(service.image)} alt={service.serviceName} />
        ))}
      </div>
      <p className="combo-price">Giá: {combo.price.toLocaleString('vi-VN')} đ</p>
      <p className="combo-description">{combo.description}</p>
      
      <h3>Dịch vụ bao gồm:</h3>
      <ul className="combo-services">
        {combo.services.map((service, index) => (
          <li key={index}>
            <h4>{service.serviceName}</h4>
            <p>{service.description}</p>
            <p>Thời gian: {service.duration} phút</p>
            <p>Giá gốc: {service.price.toLocaleString('vi-VN')} đ</p>
          </li>
        ))}
      </ul>
      
      <p className="combo-duration">Tổng thời gian ước tính: {totalDuration} phút</p>
      
      <p className="combo-savings">
        Tiết kiệm: {(combo.services.reduce((total, service) => total + service.price, 0) - combo.price).toLocaleString('vi-VN')} đ
      </p>
      <button 
        className="combo-detail__book-button" 
        onClick={handleBookingClick}
        disabled={userRole !== 'member' && userRole !== 'MEMBER'}
        title={userRole !== 'member' && userRole !== 'MEMBER' ? 'Chỉ thành viên mới có thể đặt lịch' : ''}
      >
        ĐẶT LỊCH NGAY
      </button>
    </div>
  );
};

export default ComboDetail;