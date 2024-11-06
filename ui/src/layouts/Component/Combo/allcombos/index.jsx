import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCombos } from "../../../../data/comboservice"; 
import "./index.scss";
import { message } from "antd";

const ComboCard = ({ combo, handleLinkClick, getImgurDirectUrl }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="combo-card" onClick={(e) => handleLinkClick(`/combo/${combo.id}`, e)}>
      <div className="combo-images">
        {combo.services.slice(0, 2).map((service, index) => (
          <div key={service.serviceId} className="combo-image-container">
            {!imageError ? (
              <img
                src={getImgurDirectUrl(service.image)}
                alt={service.serviceName}
                className="combo-image"
                onClick={(e) => handleLinkClick(`/combo/${combo.id}`, e)}
                onError={(e) => {
                  console.error('Image failed to load:', service.image);
                  setImageError(true);
                }}
              />
            ) : (
              <div className="combo-image-placeholder">No Image Available</div>
            )}
          </div>
        ))}
      </div>
      <h3 className="combo-title">{combo.name}</h3>
      {combo.price && (
        <p className="combo-price">Giá từ {combo.price.toLocaleString('vi-VN')} đ</p>
      )}
      <p className="combo-description">{combo.description}</p>
      <a
        href={`/combo/${combo.id}`}
        className="combo-link"
        onClick={(e) => handleLinkClick(`/combo/${combo.id}`, e)}
      >
        Tìm hiểu thêm
      </a>
    </div>
  );
};

const AllCombos = () => {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả combo');
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
        const response = await fetchCombos();
        console.log('Raw combos data:', JSON.stringify(response, null, 2));
  
        let combosData = response.result || response;
  
        if (Array.isArray(combosData)) {
          combosData.forEach((combo, index) => {
            console.log(`Combo ${index}:`, {
              id: combo.id,
              name: combo.name,
              price: combo.price,
              description: combo.description,
              services: combo.services.map(service => ({
                serviceId: service.serviceId,
                serviceName: service.serviceName,
                image: service.image
              }))
            });
          });
          setCombos(combosData);
        } else {
          console.error('Combos data is not an array:', combosData);
          setError("Dữ liệu combo không hợp lệ.");
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
    const categorySet = new Set(combos.flatMap(combo => combo.services.map(service => service.categories?.categoryName)).filter(Boolean));
    return ['Tất cả combo', ...Array.from(categorySet)];
  }, [combos]);

  const filteredCombos = combos.filter(combo => {
    const matchesSearch = 
      combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      combo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (combo.price && combo.price.toString().includes(searchTerm));
    const matchesCategory = 
      selectedCategory === 'Tất cả combo' || 
      combo.services.some(service => service.categories?.categoryName === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (combos.length === 0) return <div>Không có combo để hiển thị.</div>;

  return (
    <div className="all-combos">
      <h1>Tất cả combo</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm combo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="category-buttons">
      {console.log('Rendering categories:', categories)}
        {categories.map(category => (
          <button
            key={category}
            onClick= {e => setSelectedCategory(category, e)}
            className={selectedCategory === category ? 'active' : ''}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="combos-grid">
        {filteredCombos.map((combo, index) => (
          <ComboCard
            key={combo.id || index}
            combo={combo}
            handleLinkClick={handleLinkClick}
            getImgurDirectUrl={getImgurDirectUrl}
          />
        ))}
      </div>
      <button 
        className="all-combos__book-button" 
        onClick={handleBookingClick}
        disabled={userRole !== 'member' && userRole !== 'MEMBER'}
        title={userRole !== 'member' && userRole !== 'MEMBER' ? 'Chỉ thành viên mới có thể đặt lịch' : ''}

      >
        ĐẶT LỊCH NGAY
      </button>
    </div>
  );
};

export default AllCombos;