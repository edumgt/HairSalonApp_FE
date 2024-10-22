import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.scss";
import { fetchCombos } from "../../../../data/comboservice";

const ComboServiceCard = ({ combo, handleLinkClick, getImgurDirectUrl }) => {
    return (
      <div className="combo-services__card" onClick={(e) => handleLinkClick(`/combo/${combo.id}`, e)}>
        <div className="combo-services__images">
          {combo.services.slice(0, 2).map((service, index) => (
            <div key={service.serviceId} className="combo-services__image-container">
              <img
                src={getImgurDirectUrl(service.image)}
                alt={service.serviceName}
                className="combo-services__image"
               
                onError={(e) => {
                  console.error('Image failed to load:', service.image);
                  e.target.src = '/fallback-image.jpg'; // Fallback image
                }}
              />
            </div>
          ))}
        </div>
        <h3 className="combo-services__card-title">{combo.name}</h3>
        {combo.price && (
          <p className="combo-services__price">Giá: {combo.price.toLocaleString('vi-VN')} đ</p>
        )}
        <p className="combo-services__description">{combo.description}</p>
        <a
          href={`/combo/${combo.id}`}
          className="combo-services__link"
          onClick={(e) => handleLinkClick(`/combo/${combo.id}`, e)}
        >
          Xem chi tiết
        </a>
      </div>
    );
  };

const ComboServices = () => {
  const [combos, setCombos] = useState([]);
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
        const response = await fetchCombos();
        console.log('Raw combos data:', JSON.stringify(response, null, 2));

        let combosData = response.result;

        if (Array.isArray(combosData)) {
          combosData.forEach((combo, index) => {
            console.log(`Combo ${index}:`, {
              id: combo.id,
              name: combo.name,
              image: combo.image,
              price: combo.price
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

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (combos.length === 0) return <div>Không có combo để hiển thị.</div>;

  return (
    <div className="combo-services">
      <div className="combo-services__header">
        <h2 className="combo-services__title">COMBO DỊCH VỤ</h2>
        <div className="combo-services__view-all">
          <Link to="/tat-ca-combo" className="combo-services__view-all-link">
            Xem tất cả combo
          </Link>
        </div>
      </div>

      <div className="combo-services__grid">
        {combos.slice(0, 3).map((combo, index) => (
          <ComboServiceCard
            key={combo.id || index}
            combo={combo}
            handleLinkClick={handleLinkClick}
            getImgurDirectUrl={getImgurDirectUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ComboServices;