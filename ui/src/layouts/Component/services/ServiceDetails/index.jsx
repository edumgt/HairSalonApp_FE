import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchServices } from '../../../../data/hairservice'; 
import './index.scss';
import { message } from 'antd';
const ServiceDetail = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  const handleBookingClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.info('Vui lòng đăng nhập để đặt lịch');
      navigate('/login', { state: { from: '/booking' } });
      return;
    }

    if (userRole !== 'member') {
      message.info('Chỉ thành viên mới có thể đặt lịch');
      return;
    }

    navigate('/booking');
  };

  useEffect(() => {
    const loadServiceDetail = async () => {
      try {
        setLoading(true);
        const services = await fetchServices();

        let servicesData = services.result || services;
        servicesData = servicesData.filter(service => service.status === true);

        const selectedService = servicesData.find(s => s.serviceId === serviceId);

        if (selectedService) {
          setService(selectedService);
        } else {
          setError('Không tìm thấy thông tin dịch vụ hoặc dịch vụ không khả dụng.');
        }
      } catch (err) {
        console.error('Error loading service detail:', err);
        setError('Có lỗi xảy ra khi tải thông tin dịch vụ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadServiceDetail();
  }, [serviceId]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!service) return <div>Không tìm thấy thông tin dịch vụ.</div>;

  const getImgurDirectUrl = (url) => {
    if (!url) return '/fallback-image.jpg';
    const imgurRegex = /https?:\/\/(?:i\.)?imgur\.com\/(\w+)(?:\.\w+)?/;
    const match = url.match(imgurRegex);
    return match && match[1] ? `https://i.imgur.com/${match[1]}.jpg` : url;
  };

  return (
    <div className="service-detail">
      <h2>{service.serviceName}</h2>
      <img src={getImgurDirectUrl(service.image)} alt={service.serviceName} />
      <p>Giá: {service.price.toLocaleString('vi-VN')} đ</p>
      <p>Thời gian: {service.duration} phút</p>
      <p>Mô tả: {service.description}</p>
      {service.categories && (
        <>
          <p>Danh mục: {service.categories.categoryName}</p>
          <p>Mô tả danh mục: {service.categories.categoryDescription}</p>
        </>
      )}
      
      {service.process && service.process.length > 0 && (
        <>
          <h3>Quy trình thực hiện:</h3>
          <ol>
            {service.process.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </>
      )}
      <button 
        className={`service-detail__book-button ${userRole !== 'member' ? 'disabled' : ''}`}
        onClick={handleBookingClick}
        disabled={userRole !== 'member' && userRole !== 'MEMBER'}
        title={userRole !== 'member' && userRole !== 'MEMBER' ? 'Chỉ thành viên mới có thể đặt lịch' : ''}
      >
        ĐẶT LỊCH NGAY
      </button>
    </div>
    
  );
};

export default ServiceDetail;