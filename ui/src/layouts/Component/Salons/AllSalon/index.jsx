import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchSalons } from "../../../../data/salonService";
import "./index.scss";
import { message } from "antd";

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

const SalonCard = ({ salon }) => {
  return (
    <div className="salon-card">
      <Link to={`/salon/${salon.id}`} className="salon-image-link">
        {salon.image && (
          <img
            src={getImgurDirectUrl(salon.image)}
            alt={`30Shine ${salon.name}`}
            className="salon-image"
          />
        )}
      </Link>
      <div className="salon-content">
        <h3 className="salon-title">{salon.name}</h3>
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
  const [showOpenOnly, setShowOpenOnly] = useState(true);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchSalons();
        
        if (response && response.code === 0) {
          const salonsData = response.result
            .filter(salon => salon.open === true)
            .map(salon => ({
              ...salon,
              salonId: salon.id
            }));
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

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
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

  const filteredSalons = salons.filter(salon => {
    const normalizedSearch = searchTerm.toLowerCase().replace(/quận\s*/g, '').trim();
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
  if (salons.length === 0) return <div>Không có salon nào đang mở cửa.</div>;

  return (
    <div className="all-salons">
      <h1>Hệ Thống Salon Đang Mở Cửa</h1>
      <div className="salon-count">
        <span>Hiện có {salons.length} salon đang hoạt động</span>
      </div>
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
            {district === 'Tất cả' ? district :  `Quận ${district}`}
          </button>
        ))}
      </div>
      <div className="salons-grid">
        {filteredSalons.map((salon) => (
          <SalonCard
            key={salon.id}
            salon={salon}
          />
        ))}
      </div>
      <button 
        className={`all-salons__book-button ${userRole !== 'member' ? 'disabled' : ''}`}
        onClick={handleBookingClick}
        disabled={userRole !== 'member' && userRole !== 'MEMBER'}
        title={userRole !== 'member' && userRole !== 'MEMBER' ? 'Chỉ thành viên mới có thể đặt lịch' : ''}
      >
        ĐẶT LỊCH NGAY
      </button>
    </div>
  );
};

export default AllSalon;