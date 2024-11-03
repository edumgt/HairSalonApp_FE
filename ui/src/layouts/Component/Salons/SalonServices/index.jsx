import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.scss";
import { fetchSalons } from "../../../../data/salonService";
// Import ảnh local
import bacninh_1 from '../../../../assets/imageHome/Salon/88_BacNinh.jpg';
import bacninh_2 from '../../../../assets/imageHome/Salon/201_BacNinh.jpg';
import dongnai_1 from '../../../../assets/imageHome/Salon/DongNai1.jpg';
import dongnai_2 from '../../../../assets/imageHome/Salon/DongNai2.jpg';
import dongnai_3 from '../../../../assets/imageHome/Salon/DongNai3.jpg';
import dongnai_4 from '../../../../assets/imageHome/Salon/DongNai4.jpg';

// Map ảnh với district
const SALON_IMAGES = {
  'Tân Bình': [bacninh_1, bacninh_2],
  'Tân Phú': [dongnai_1, dongnai_2, dongnai_3, dongnai_4],
  // Thêm các district khác
};

const getSalonImage = (district) => {
  const districtImages = SALON_IMAGES[district];
  return districtImages?.[0] || dongnai_1; // Trả về ảnh đầu tiên hoặc ảnh mặc định
};

const SalonCard = ({ salon }) => {
  return (
    <div className="salon-services__card">
      <Link to={`/salon/${salon.id}`}>
        <img
          src={getSalonImage(salon.district)}
          alt={`30Shine Quận ${salon.district}`}
          className="salon-services__image"
        />
      </Link>
      <div className="salon-services__content">
        <h3 className="salon-services__card-title">30Shine Quận {salon.district}</h3>
        <p className="salon-services__address">{salon.address}</p>
        <div className="salon-services__status">
          <span className={`status-badge ${salon.open ? 'open' : 'closed'}`}>
            {salon.open ? 'Đang mở cửa' : 'Đã đóng cửa'}
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
        console.log('Response in component:', response);
        
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
        console.error('Error in component:', err);
        setError(err?.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!salons.length) return <div>Không có salon nào để hiển thị.</div>;

  return (
    <div className="salon-services">
      <div className="salon-services__header">
        <h2 className="salon-services__title">HỆ THỐNG SALON</h2>
        <div className="salon-services__view-all">
          <Link to="/tat-ca-salon" className="salon-services__view-all-link">
            Xem tất cả salon
          </Link>
        </div>
      </div>

      <div className="salon-services__grid">
        {salons.slice(0, 3).map((salon) => (
          <SalonCard
            key={salon.salonId}
            salon={salon}
          />
        ))}
      </div>
    </div>
  );
};

export default SalonServices;