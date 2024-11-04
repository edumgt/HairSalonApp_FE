import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchServices } from "../../../../data/hairservice"; 
import "./index.scss";
import { message } from "antd";

const ServiceCard = ({ service, handleLinkClick, getImgurDirectUrl }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="service-card">
      {!imageError ? (
        <img
          src={getImgurDirectUrl(service.image)}
          alt={service.serviceName}
          className="service-image"
          onClick={(e) => handleLinkClick(`/dich-vu/${service.serviceId}`, e)}
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
        onClick={(e) => handleLinkClick(`/dich-vu/${service.serviceId}`, e)}
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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả dịch vụ');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
      const storedUserRole = localStorage.getItem('userRole');
      setUserRole(storedUserRole || '');
    }, []);

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
    
          let servicesData = response.result || response;
    
          if (Array.isArray(servicesData)) {
            servicesData.forEach((service, index) => {
              console.log(`Service ${index}:`, {
                id: service.serviceId,
                name: service.serviceName,
                image: service.image,
                price: service.price,
                categoryName: service.categories?.categoryName 
              });
            });
            setServices(servicesData);
            
            // Cập nhật cách lấy categoryName
            console.log('All categoryNames:', servicesData.map(service => service.categories?.categoryName));
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

    const categories = useMemo(() => {
      const categorySet = new Set(services.map(service => service.categories?.categoryName).filter(Boolean));
      return ['Tất cả dịch vụ', ...Array.from(categorySet)];
    }, [services]);

    const filteredServices = services.filter(service => {
      const matchesSearch = 
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.price && service.price.toString().includes(searchTerm));
      const matchesCategory = 
        selectedCategory === 'Tất cả dịch vụ' || service.categories?.categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (services.length === 0) return <div>Không có dịch vụ để hiển thị.</div>;


    
    return (
      <div className="all-services">
        <h1>Tất cả dịch vụ</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-buttons">
        {console.log('Rendering categories:', categories)}
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'active' : ''}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="services-grid" >
          {filteredServices.map((service, index) => (
            <ServiceCard
              key={service.serviceId || index}
              service={service}
              handleLinkClick={handleLinkClick}
              getImgurDirectUrl={getImgurDirectUrl}
            />
          ))}
        </div>
        <button 
          className="all-services__book-button" 
          onClick={handleBookingClick}
          disabled={userRole && userRole !== 'MEMBER'}
          title={userRole && userRole !== 'MEMBER' ? 'Chỉ thành viên mới có thể đặt lịch' : ''}
        >
          ĐẶT LỊCH NGAY
        </button>
      </div>
    );
};

export default AllServices;