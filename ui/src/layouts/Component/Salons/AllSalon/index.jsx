import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchSalons } from "../../../../data/salonService";
import "./index.scss";
import { message } from "antd";

// Import ảnh local
import bacninh_1 from '../../../../assets/imageHome/Salon/88_BacNinh.jpg';
import bacninh_2 from '../../../../assets/imageHome/Salon/201_BacNinh.jpg';
import dongnai_1 from '../../../../assets/imageHome/Salon/DongNai1.jpg';
import dongnai_2 from '../../../../assets/imageHome/Salon/DongNai2.jpg';
import dongnai_3 from '../../../../assets/imageHome/Salon/DongNai3.jpg';
import dongnai_4 from '../../../../assets/imageHome/Salon/DongNai4.jpg';

const SALON_IMAGES = {
  '10': [bacninh_1],
  '9': [bacninh_2],
  'Tân bình': [dongnai_1, dongnai_2],
  'Bình Tân': [dongnai_3, dongnai_4],
  'default': [dongnai_1]
};

const getSalonImage = (district) => {
  const districtImages = SALON_IMAGES[district] || SALON_IMAGES['default'];
  return districtImages[0];
};

const SalonCard = ({ salon }) => {
  return (
    <div className="salon-card">
      <Link to={`/salon/${salon.id}`} className="salon-image-link">
        <img
          src={getSalonImage(salon.district)}
          alt={`30Shine Quận ${salon.district}`}
          className="salon-image"
        />
      </Link>
      <div className="salon-content">
        <h3 className="salon-title">30Shine Quận {salon.district}</h3>
        <p className="salon-address">
          <i className="fas fa-map-marker-alt"></i> {salon.address}
        </p>
        <div className="salon-status">
          <span className={`status-badge ${salon.open ? 'open' : 'closed'}`}>
            {salon.open ? 'Đang mở cửa' : 'Đã đóng cửa'}
          </span>
        </div>
        <Link
          to={`/salon/${salon.id}`}
          className="salon-link"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

const AllSalon = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchSalons();
        console.log('Salon Response:', response);
        
        if (response && response.code === 0) {
          const salonsData = response.result.map(salon => ({
            ...salon,
            salonId: salon.id
          }));
          console.log('Processed salon data:', salonsData);
          setSalons(salonsData);
        } else {
          setError(response?.message || "Không thể tải dữ liệu salon");
        }
      } catch (err) {
        console.error('Error loading salons:', err);
        setError(err?.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const districts = useMemo(() => {
    const districtSet = new Set(salons.map(salon => salon.district));
    return ['Tất cả', ...Array.from(districtSet)];
  }, [salons]);

  const handleLinkClick = (link, event) => {
    event.preventDefault();
    navigate(link);
  };

  const handleBookingClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/booking');
    } else {
      message.info('Vui lòng đăng nhập để đặt lịch');
      navigate('/login', { state: { from: '/booking' } });
    }
  };

  const filteredSalons = salons.filter(salon => {
    // Chuẩn hóa chuỗi tìm kiếm và loại bỏ chữ "quận" nếu có
    const normalizedSearch = searchTerm.toLowerCase().replace(/quận\s*/g, '').trim();
    
    // Chuẩn hóa địa chỉ và district để tìm kiếm
    const normalizedAddress = salon.address.toLowerCase();
    const normalizedDistrict = salon.district.toLowerCase();
    
    const matchesSearch = 
      normalizedAddress.includes(normalizedSearch) ||
      normalizedDistrict.includes(normalizedSearch);
    
    const matchesDistrict = 
      selectedDistrict === 'Tất cả' || salon.district === selectedDistrict;
    
    return matchesSearch && matchesDistrict;
  });

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (salons.length === 0) return <div>Không có salon nào để hiển thị.</div>;

  return (
    <div className="all-salons">
      <h1>Hệ Thống Salon</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm salon theo địa chỉ hoặc quận"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="district-buttons">
        {districts.map(district => (
          <button
            key={district}
            onClick={() => setSelectedDistrict(district)}
            className={selectedDistrict === district ? 'active' : ''}
          >
          {district === 'Tất cả' ? district : `Quận ${district}`}
          </button>
        ))}
      </div>
      <div className="salons-grid">
        {filteredSalons.map((salon) => (
          <SalonCard
            key={salon.salonId}
            salon={salon}
          />
        ))}
      </div>
      <button className="all-salons__book-button" onClick={handleBookingClick}>
        ĐẶT LỊCH NGAY
      </button>
    </div>
  );
};

export default AllSalon;