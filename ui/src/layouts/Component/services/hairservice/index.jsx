import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.scss";
import { fetchServices } from "../../../../data/hairservice";

const HairServiceCard = ({ service, handleLinkClick, getImgurDirectUrl }) => {
  const [imageError, setImageError] = useState(false);


  return (
    <div className="hair-services__card">
      {!imageError ? (
        <img
          src={getImgurDirectUrl(service.image)}
          alt={service.serviceName}
          className="hair-services__image"
          onClick={(e) => handleLinkClick(`/dich-vu-cat-toc/${service.serviceId}`, e)}
          onError={(e) => {
            console.error('Image failed to load:', service.image);
            setImageError(true);
          }}
        />
      ) : (
        <div className="hair-services__image-placeholder">No Image Available</div>
      )}
      <h3 className="hair-services__card-title">{service.serviceName}</h3>
      {service.price && (
        <p className="hair-services__price">Giá từ {service.price.toLocaleString('vi-VN')} đ</p>
      )}
      <Link
        to={`/dich-vu-cat-toc/${service.serviceId}`}
        className="hair-services__link"
      >
        Tìm hiểu thêm 
      </Link>
    </div>
  );
};

const HairServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);

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
          if (servicesData.length > 0 && servicesData[0].categories) {
            setCategory(servicesData[0].categories);
          }
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
    <div className="hair-services">
      <div className="hair-services__header">
        <h2 className="hair-services__title">DỊCH VỤ</h2>
        <div className="hair-services__view-all">
          <Link to="/tat-ca-dich-vu" className="hair-services__view-all-link">
            Xem tất cả dịch vụ
          </Link>
        </div>
      </div>

      <div className="hair-services__grid">
        {services.slice(0, 3).map((service, index) => (
          <HairServiceCard
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

export default HairServices;