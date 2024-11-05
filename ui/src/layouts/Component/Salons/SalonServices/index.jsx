import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.scss";
import { fetchSalons } from "../../../../data/salonService";

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
  const imageUrl = useMemo(() => getImgurDirectUrl(salon.image), [salon.image]);

  return (
    <div className="salon-services__card">
      <Link to={`/salon/${salon.id}`}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`30Shine ${salon.district}`}
            className="salon-services__image"
            loading="lazy"
          />
        )}
      </Link>
      <div className="salon-services__content">
        <h3 className="salon-services__card-title">30Shine Quận {salon.district}</h3>
        <p className="salon-services__address">{salon.address}</p>
        <div className="salon-services__status">
          <span className={`status-badge ${salon.open ? 'open' : 'closed'}`}>
            {salon.open ? (
              <>
                <span className="status-dot"></span>
                Đang mở cửa
              </>
            ) : (
              'Đã đóng cửa'
            )}
          </span>
        </div>
        <Link
          to={`/salon/${salon.id}`}
          className="salon-services__link"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

const SalonServices = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchSalons();
        
        if (response && response.code === 0) {
          const openSalons = response.result
            .filter(salon => salon.open === true)
            .map(salon => ({
              ...salon,
              salonId: salon.id
            }));
          setSalons(openSalons);
        } else {
          setError(response?.message || "Không thể tải dữ liệu salon");
        }
      } catch (err) {
        setError(err?.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!salons.length) return <div>Không có salon nào đang mở cửa.</div>;

  return (
    <div className="salon-services">
      <div className="salon-services__header">
        <h2 className="salon-services__title">HỆ THỐNG SALON </h2>
        <div className="salon-services__view-all">
          <Link to="/tat-ca-salon" className="salon-services__view-all-link">
            Xem tất cả salon
          </Link>
        </div>
      </div>

      <div className="salon-services__grid">
        {salons.slice(0, 3).map((salon) => (
          <SalonCard
            key={salon.id}
            salon={salon}
          />
        ))}
      </div>
    </div>
  );
};

export default SalonServices;