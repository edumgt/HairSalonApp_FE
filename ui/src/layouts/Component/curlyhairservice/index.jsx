import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.scss';

// Import các hình ảnh cần thiết
import uonTieuChuan1 from '../../../assets/imageHome/Service/uontoc/uon-tieu-chuan-1.jpg';
import uonTieuChuan2 from '../../../assets/imageHome/Service/uontoc/uon-tieu-chuan-2.jpg';
import uonTieuChuan3 from '../../../assets/imageHome/Service/uontoc/uon-tieu-chuan-3.jpg';
import uonCaoCap1 from '../../../assets/imageHome/Service/uontoc/uon-cao-cap-1.jpg';
import uonCaoCap2 from '../../../assets/imageHome/Service/uontoc/uon-cao-cap-2.jpg';
import uonCaoCap3 from '../../../assets/imageHome/Service/uontoc/uon-cao-cap-3.jpg';
import nhuomTieuChuan1 from '../../../assets/imageHome/Service/uontoc/nhuom-tieu-chuan-1.jpg';
import nhuomTieuChuan2 from '../../../assets/imageHome/Service/uontoc/nhuom-tieu-chuan-2.jpg';
import nhuomTieuChuan3 from '../../../assets/imageHome/Service/uontoc/nhuom-tieu-chuan-3.jpg';
import nhuomCaoCap1 from '../../../assets/imageHome/Service/uontoc/nhuom-cao-cap-1.jpg';
import nhuomCaoCap2 from '../../../assets/imageHome/Service/uontoc/nhuom-cao-cap-2.jpg';
import nhuomCaoCap3 from '../../../assets/imageHome/Service/uontoc/nhuom-cao-cap-3.jpg';


const HairStylingServices = () => {


    const location = useLocation();

  useEffect(() => {
    if (location.hash === '#nhuomtoc') {
      const element = document.getElementById('nhuomtoc');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);
  const services = [
    {   
      id: "uontieuchuan",
      title: 'UỐN ĐỊNH HÌNH NẾP TÓC',
      subtitle: 'Dịch vụ uốn định hình nếp tóc độc quyền tại 30Shine thiết kế lên những mái tóc bồng bềnh, tự nhiên và không mất công tạo kiểu',
      options: [
        {
          title: 'Uốn Tiêu Chuẩn',
          description: 'Định hình tóc phồng đẹp tự nhiên, vào nếp bền đẹp mỗi ngày.',
          images: [uonTieuChuan1, uonTieuChuan2, uonTieuChuan3],
          price: '379K',
          link: "/dich-vu/uon/uon-tieu-chuan"
        },
        {
          title: 'Uốn Cao Cấp',
          description: 'Công nghệ Uốn định hình chuyên nam sử dụng thuốc uốn cao cấp',
          images: [uonCaoCap1, uonCaoCap2, uonCaoCap3],
          price: '448K',
          link: "/dich-vu/uon/uon-cao-cap"
        },
      ]
    },
    {
      id: "nhuomtoc",
      title: 'THAY ĐỔI MÀU TÓC',
      subtitle: 'Màu tóc giúp định hình phong cách và thay đổi diện mạo một cách đột phá mà bất cứ ai cũng nên thử.',
      options: [
        {
          title: 'Nhuộm Tiêu Chuẩn',
          description: 'Dịch vụ thay đổi màu tóc giúp anh tự tin, trẻ trung và phong cách',
          images: [nhuomTieuChuan1, nhuomTieuChuan2, nhuomTieuChuan3],
          price: '199K',
          duration: '30 Phút',
          link: "/dich-vu/nhuom/nhuom-tieu-chuan"
        },
        {
          title: 'Nhuộm Cao Cấp',
          description: 'Dịch vụ thay đổi màu tóc được tin dùng với thuốc nhuộm Davines cao cấp',
          images: [nhuomCaoCap1, nhuomCaoCap2, nhuomCaoCap3],
          price: '289K',
          duration: '45 Phút',
          link: "/dich-vu/nhuom/nhuom-cao-cap"
        },
      ]
    },
  ];

  return (
    <div className="hair-styling-services">
      {services.map((service, serviceIndex) => (
        <div key={serviceIndex} className="service-category" id={service.id}>
          <h1 className="service-category__title">{service.title}</h1>
          <p className="service-category__subtitle">{service.subtitle}</p>
          <div className="service-category__grid">
            {service.options.map((option, optionIndex) => (
              <Link to={option.link} key={optionIndex} className="service-card">
                <h2 className="service-card__title">{option.title}</h2>
                <p className="service-card__description">{option.description}</p>
                <div className="service-card__image-container">
                  <img className="service-card__main-image" src={option.images[0]} alt={option.title} />
                  <div className="service-card__sub-images">
                    {option.images.slice(1, 3).map((img, i) => (
                      <img key={i} src={img} alt={`${option.title} ${i + 2}`} />
                    ))}
                  </div>
                </div>
                <div className="service-card__footer">
                  <span className="service-card__duration">{option.duration}</span>
                  <span className="service-card__price">Chỉ từ {option.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <button className="hair-styling-services__book-button">ĐẶT LỊCH NGAY</button>
    </div>
  );
};

export default HairStylingServices;