import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './index.scss';

// Import các hình ảnh cần thiết
import combo2Image1 from '../../../assets/imageHome/Service/spa/goi-combo-2-1.jpg';
import combo2Image2 from '../../../assets/imageHome/Service/spa/goi-combo-2-2.jpg';
import combo2Image3 from '../../../assets/imageHome/Service/spa/goi-combo-2-3.jpg';
import combo3Image1 from '../../../assets/imageHome/Service/spa/goi-combo-3-1.jpg';
import combo3Image2 from '../../../assets/imageHome/Service/spa/goi-combo-3-2.jpg';
import combo3Image3 from '../../../assets/imageHome/Service/spa/goi-combo-3-3.jpg';
import combo4Image1 from '../../../assets/imageHome/Service/spa/goi-combo-4-1.jpg';
import combo4Image2 from '../../../assets/imageHome/Service/spa/goi-combo-4-2.jpg';
import combo4Image3 from '../../../assets/imageHome/Service/spa/goi-combo-4-3.jpg';
import combo5Image1 from '../../../assets/imageHome/Service/spa/goi-combo-5-1.jpg';
import combo5Image2 from '../../../assets/imageHome/Service/spa/goi-combo-5-2.jpg';
import combo5Image3 from '../../../assets/imageHome/Service/spa/goi-combo-5-3.jpg';
import layRayTaiImage1 from '../../../assets/imageHome/Service/spa/lay-ray-tai-1.jpg';
import layRayTaiImage2 from '../../../assets/imageHome/Service/spa/lay-ray-tai-2.jpg';
import layRayTaiImage3 from '../../../assets/imageHome/Service/spa/lay-ray-tai-3.jpg';

const SpaCombo = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const services = [
    {
      id: "goi-massage-relax",
      title: 'GỘI MASSAGE RELAX',
      subtitle: 'Nơi đàn ông không chỉ cắt tóc mà còn tận hưởng gội đầu & massage đầy sảng khoái',
      options: [
        {
          title: 'Gội Combo 2',
          description: 'Combo gội massage cổ vai gáy thư giãn giảm căng thẳng',
          images: [combo2Image1, combo2Image2, combo2Image3],
          duration: '25 Phút',
          link: "/dich-vu/spa/goi-combo-2"
        },
        {
          title: 'Gội Combo 3',
          description: 'Combo gội massage và chăm sóc da chuyên sâu sáng đều màu da bằng thiết bị công nghệ cao',
          images: [combo3Image1, combo3Image2, combo3Image3],
          duration: '35 Phút',
          link: "/dich-vu/spa/goi-combo-3"
        },
        {
          title: 'Gội Combo 4',
          description: 'Combo gội massage bấm huyệt đầu và giãn cơ lưng cổ vai gáy bằng đá nóng Himalaya',
          images: [combo4Image1, combo4Image2, combo4Image3],
          duration: '45 Phút',
          link: "/dich-vu/spa/goi-combo-4"
        },
        {
          title: 'Gội Combo 5',
          description: 'Combo gội massage và lấy nhân mụn chuyên y khoa giúp trẻ hóa làn da bằng thiết bị công nghệ hiện đại',
          images: [combo5Image1, combo5Image2, combo5Image3],
          duration: '45 Phút',
          link: "/dich-vu/spa/goi-combo-5"
        },
      ]
    },

    {
        id: "lay-ray-tai",
        title: 'LẤY RÁY TAI',
        subtitle: 'Kỹ thuật lấy ráy tai nhẹ nhàng & thư thái trong không gian yên tĩnh, sạch sẽ.',
        options: [
          {
            title: 'Lấy ráy tai êm',
            description: 'Kỹ thuật lấy ráy tai nhẹ nhàng & thư thái trong không gian yên tĩnh, sạch sẽ.',
            images: [layRayTaiImage1, layRayTaiImage2, layRayTaiImage3],
            duration: '30 Phút',
            link: "/dich-vu/spa/lay-ray-tai"
          },
        ]
      },
  ];

  return (
    <div className="spa-combo">
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
                  {option.price && <span className="service-card__price">Chỉ từ {option.price}</span>}
                  <span className="service-card__link">Tìm hiểu thêm &gt;</span>
                </div>  
              </Link>
            ))}
          </div>
        </div>
      ))}
      <button className="spa-combo__book-button">ĐẶT LỊCH NGAY</button>
    </div>
  );
};

export default SpaCombo;