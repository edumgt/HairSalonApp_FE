import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.scss';
import thuongGia1 from '../../../assets/imageHome/Service/cat-goi-combo-thuong-gia-1.jpg';
import thuongGia2 from '../../../assets/imageHome/Service/cat-goi-combo-thuong-gia-2.jpg';
import thuongGia3 from '../../../assets/imageHome/Service/cat-goi-combo-thuong-gia-3.jpg';
import catgoicombo1 from '../../../assets/imageHome/Service/cat-goi-combo-1-1.jpg';
import catgoicombo2 from '../../../assets/imageHome/Service/cat-goi-combo-1-2.jpg';
import catgoicombo3 from '../../../assets/imageHome/Service/cat-goi-combo-1-3.jpg'; 
import catgoicombo4 from '../../../assets/imageHome/Service/cat-goi-combo-2-1.jpg';
import catgoicombo5 from '../../../assets/imageHome/Service/cat-goi-combo-2-2.jpg';
import catgoicombo6 from '../../../assets/imageHome/Service/cat-goi-combo-2-3.jpg';        
import catgoicombo7 from '../../../assets/imageHome/Service/cat-goi-combo-3-1.jpg';
import catgoicombo8 from '../../../assets/imageHome/Service/cat-goi-combo-3-2.jpg';
import catgoicombo9 from '../../../assets/imageHome/Service/cat-goi-combo-3-3.jpg';
import catgoicombo10 from '../../../assets/imageHome/Service/cat-goi-combo-4-1.jpg';
import catgoicombo11 from '../../../assets/imageHome/Service/cat-goi-combo-4-2.jpg';
import catgoicombo12 from '../../../assets/imageHome/Service/cat-goi-combo-4-3.jpg';
import catgoicombo13 from '../../../assets/imageHome/Service/cat-goi-combo-5-1.jpg';
import catgoicombo14 from '../../../assets/imageHome/Service/cat-goi-combo-5-2.jpg';
import catgoicombo15 from '../../../assets/imageHome/Service/cat-goi-combo-5-3.jpg';

const HairCutServices = () => {

  const navigate = useNavigate();

  const handleCardClick = (link) => {
    if (link) {
      navigate(link);
    }
  };
  
  const services = [
    {
        title: 'Cắt gội khoang thượng gia',
      description: ['Combo cắt kỹ', 'Combo gội massage'],
      duration: '50 Phút',
      images: [
        thuongGia1,
        thuongGia2,
        thuongGia3,
      ],    
      link: "/dich-vu/cat-goi-thuong-gia"
    },  
    {
        title: 'Cắt gội Combo 1',
      description: ['Combo cắt kỹ', 'Combo gội massage'],
      duration: '50 Phút',
      images: [
        catgoicombo1,
        catgoicombo2,
        catgoicombo3,
      ],    
      link: "/dich-vu/cat-goi-combo-1"
    },
    {
        title: 'Cắt gội Combo 2',
      description: ['Combo cắt kỹ', 'Combo gội massage cổ vai gáy'],
      duration: '50 Phút',
      images: [
        catgoicombo4,
        catgoicombo5,
        catgoicombo6,
      ],    
      link: "/dich-vu/cat-goi-combo-2"
    },  
    {
        title: 'Cắt gội Combo 3',
      description: ['Combo cắt kỹ', 'Combo gội massage chăm sóc da'],
      duration: '50 Phút',
      images: [
        catgoicombo7,
        catgoicombo8,
        catgoicombo9,
      ],    
      link: "/dich-vu/cat-goi-combo-3"
    },  
    {
        title: 'Cắt gội Combo 4',
      description: ['Combo cắt kỹ', 'Combo gội massage bằng đá nóng'],
      duration: '50 Phút',
      images: [
        catgoicombo10,
        catgoicombo11,
        catgoicombo12,
      ],    
      link: "/dich-vu/cat-goi-combo-4"
    },  
    {
        title: 'Cắt gội Combo 5',
      description: ['Combo cắt kỹ', 'Combo gội massage lấy nhân mụn chuyên sâu'],
      duration: '50 Phút',
      images: [
        catgoicombo13,
        catgoicombo14,
        catgoicombo15,
      ],    
      link: "/dich-vu/cat-goi-combo-5"
    },  
  ];

  return (
    <div className="hair-cut-services">
      <h1 className="hair-cut-services__title">CẮT TÓC</h1>
      <p className="hair-cut-services__subtitle">
        Trải nghiệm cắt tóc phong cách dành riêng cho phái mạnh, vừa tiện lợi vừa thư giãn tại đây
      </p>
      <div className="hair-cut-services__grid">
        {services.map((service, index) => (
          <Link to={service.link} key={index} className="hair-cut-services__card" onClick={() => handleCardClick(service.link)}>
          <h2 className="hair-cut-services__card-title">{service.title}</h2>
          <div className="hair-cut-services__card-description">
            {service.description.map((desc, i) => (
              <p key={i}>{desc}</p>
            ))}
          </div>
          <div className="hair-cut-services__image-container">
            {service.images.map((img, i) => (
              <img key={i} src={img} alt={`${service.title} ${i + 1}`} />
            ))}
          </div>
          <div className="hair-cut-services__card-footer">
            <span className="hair-cut-services__duration">{service.duration}</span>
            <span className="hair-cut-services__link">Tìm hiểu thêm &gt;</span>
          </div>
        </Link>
        ))}
      </div>
      <button className="hair-cut-services__book-button">ĐẶT LỊCH NGAY</button>
    </div>
  );
};

export default HairCutServices;