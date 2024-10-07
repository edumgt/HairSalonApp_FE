import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';
import { serviceDetails } from '../../../../data/serviceDetails';
import { spaComboDetail } from '../../../../data/spaComboDetail';
import { hairStylingDetail } from '../../../../data/hairStylingDetail'; 
import debounce from 'lodash/debounce';
const BookingComponent = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get('step');
    if (stepParam !== null) {
      setStep(parseInt(stepParam, 10));
    } else {
      setStep(0);
    }
  }, [location]);

  const handleViewAllSalons = () => {
    navigate('/booking?step=1');
  };

  const handleViewAllServices = () => {
    navigate('/booking?step=2');
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="booking-steps">
            <div className="step">
              <h3>1. Chọn salon</h3>
              <div className="option" onClick={handleViewAllSalons}>
                <span className="icon">🏠</span>
                <span>Xem tất cả salon</span>
                <span className="arrow">›</span>
              </div>
            </div>
            <div className="step">
              <h3>2. Chọn dịch vụ</h3>
              <div className="option" onClick={handleViewAllServices}>
              <span className="icon">✂️</span>
              <span>Xem tất cả dịch vụ hấp dẫn</span>
              <span className="arrow">›</span>
            </div>
            </div>
            <div className="step">
              <h3>3. Chọn ngày, giờ & stylist</h3>
              <div className="option">
              <span className="icon">📅</span>
              <span>Hôm nay, T2 (07/10)</span>
              <span className="tag">Ngày thường</span>
              <span className="arrow">›</span>
            </div>
            </div>
          </div>
        );
      case 1:
        return <SalonSelectionStep />;
      case 2:
        return <ServiceSelectionStep />;
      case 3:
        return <DateTimeSelectionStep />;
      default:
        return null;
    }
  };

  return (
    <div className="booking-wrapper">
      <h2>Đặt lịch giữ chỗ</h2>
      <div className="booking-container">
        {renderStepContent()}
         <button className="submit-button">CHỐT GIỜ CẮT</button>
      </div>
    </div>
  );
};

const SalonSelectionStep = () => {
  const cities = [
    'An Giang', 'Bắc Ninh', 'Bình Định', 'Bình Dương', 'Cần Thơ',
    'Đà Nẵng', 'Đắk Lắc', 'Đồng Nai', 'HCM', 'Hà Nội',
    'Hà Tĩnh', 'Hải Phòng', 'Khánh Hòa', 'Long An', 'Nghệ An',
    'Quảng Ninh', 'Thái Nguyên', 'Thanh Hóa', 'Tiền Giang', 'Vũng Tàu'
  ];

  return (
    <div className="salon-selection">
      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm salon theo tỉnh, thành phố, quận" />
      </div>
      <button className="find-nearby">
        <span className="icon">📍</span> Tìm salon gần anh
      </button>
      <div className="city-list">
        <h3>30Shine có mặt trên các tỉnh thành:</h3>
        <div className="city-grid">
          {cities.map((city, index) => (
            <button key={index} className="city-button">{city}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceSelectionStep = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filteredServices, setFilteredServices] = useState([]);
  
    const allServices = {
      ...serviceDetails,
      ...spaComboDetail,
      ...hairStylingDetail
    };
  
    const filterServices = useCallback((search, category) => {
      return Object.entries(allServices).filter(([key, service]) => {
        const matchesSearch = 
          service.title.toLowerCase().includes(search.toLowerCase()) ||
          service.description.toLowerCase().includes(search.toLowerCase()) ||
          (service.price && service.price.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = category === 'all' || key.includes(category);
        return matchesSearch && matchesCategory;
      });
    }, [allServices]);
  
    const debouncedFilter = useCallback(
      debounce((search, category) => {
        const filtered = filterServices(search, category);
        setFilteredServices(filtered);
      }, 300),
      [filterServices]
    );
  
    useEffect(() => {
      debouncedFilter(searchTerm, selectedCategory);
    }, [searchTerm, selectedCategory, debouncedFilter]);
  
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
    const handleCategoryChange = (category) => {
      setSelectedCategory(category);
    };
  
    return (
      <div className="service-selection">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Tìm kiếm dịch vụ, nhóm dịch vụ hoặc giá" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="category-buttons">
          <button onClick={() => handleCategoryChange('all')} className={selectedCategory === 'all' ? 'active' : ''}>Tất cả dịch vụ</button>
          <button onClick={() => handleCategoryChange('cat-goi')} className={selectedCategory === 'cat-goi' ? 'active' : ''}>Cắt gội xả massage</button>
          <button onClick={() => handleCategoryChange('uon')} className={selectedCategory === 'uon' ? 'active' : ''}>Uốn định hình tóc</button>
          <button onClick={() => handleCategoryChange('nhuom')} className={selectedCategory === 'nhuom' ? 'active' : ''}>Nhuộm tóc</button>
          <button onClick={() => handleCategoryChange('goi-combo')} className={selectedCategory === 'goi-combo' ? 'active' : ''}>Gội massage</button>
        </div>
        <div className="service-list">
          {filteredServices.map(([key, service]) => (
            <div key={key} className="service-item">
              <img src={service.steps[0].image} alt={service.title} />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <p className="price">{service.price || 'Giá liên hệ'}</p>
              <button className="add-service">Thêm dịch vụ</button>
            </div>
          ))}
        </div>
        {filteredServices.length === 0 && (
          <p className="no-results">Không tìm thấy dịch vụ phù hợp.</p>
        )}
      </div>
    );
  };

const DateTimeSelectionStep = () => {
  return <div>Chọn ngày, giờ & stylist</div>;
};

export default BookingComponent;