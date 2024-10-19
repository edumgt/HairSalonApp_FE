import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchServices } from "../../../../data/hairservice"; 
import "./index.scss";

const ServiceCard = ({ service, handleLinkClick, getImgurDirectUrl }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="service-card">
      {!imageError ? (
        <img
          src={getImgurDirectUrl(service.image)}
          alt={service.serviceName}
          className="service-image"
          onClick={(e) => handleLinkClick(`/dich-vu-cat-toc/${service.serviceId}`, e)}
          onError={(e) => {
            console.error('Image failed to load:', service.image);
            setImageError(true);
          }}
        />
      ) : (
        <div className="service-image-placeholder">No Image Available</div>
      )}
      <h3 className="service-title">{service.serviceName}</h3>
      {service.price && (
        <p className="service-price">Giá từ {service.price.toLocaleString('vi-VN')} đ</p>
      )}
      <a
        href={`/dich-vu-cat-toc/${service.serviceId}`}
        className="service-link"
        onClick={(e) => handleLinkClick(`/dich-vu-cat-toc/${service.serviceId}`, e)}
      >
        Tìm hiểu thêm
      </a>
    </div>
  );
};

const AllServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const getImgurDirectUrl = useCallback((url) => {
    if (!url) {
      console.warn('Image URL is undefined');
      return '/fallback-image.jpg';
    }
    const imgurRegex = /https?:\/\/(?:i\.)?imgur\.com\/(\w+)(?:\.\w+)?/;
    const match = url.match(imgurRegex);
    if (match && match[1]) {
      return `https://i.imgur.com/${match[1]}.jpg`;
    }
    console.warn('Invalid Imgur URL:', url);
    return url;
  }, []);

  const handleLinkClick = useCallback((link, event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(link);
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchServices();
        console.log('Raw services data:', JSON.stringify(response, null, 2));

        let servicesData = response;
        if (response && response.result) {
          servicesData = response.result;
        }

        if (Array.isArray(servicesData)) {
          servicesData.forEach((service, index) => {
            console.log(`Service ${index}:`, {
              id: service.serviceId,
              name: service.serviceName,
              image: service.image,
              price: service.price
            });
          });
          setServices(servicesData);
        } else {
          console.error('Services data is not an array:', servicesData);
          setError("Dữ liệu dịch vụ không hợp lệ.");
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (services.length === 0) return <div>Không có dịch vụ để hiển thị.</div>;

  return (
    <div className="all-services">
      <h1>Tất cả dịch vụ</h1>
      <div className="services-grid">
        {services.map((service, index) => (
          <ServiceCard
            key={service.serviceId || index}
            service={service}
            handleLinkClick={handleLinkClick}
            getImgurDirectUrl={getImgurDirectUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default AllServices;