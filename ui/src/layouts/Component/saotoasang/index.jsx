import React, { useRef, useState } from "react";
import "./index.scss";
import binhan from "../../../assets/imageHome/Saotoasang/8.jpg"
import hoangsao from "../../../assets/imageHome/Saotoasang/1.jpg"
import dokimphuc from "../../../assets/imageHome/Saotoasang/2.jpg"
import phanvanduc from "../../../assets/imageHome/Saotoasang/3.jpg"
import thanhchung from "../../../assets/imageHome/Saotoasang/4.jpg"
import tantai from "../../../assets/imageHome/Saotoasang/5.jpg"
import tienlinh from "../../../assets/imageHome/Saotoasang/6.jpg"
const BrandAmbassadors = () => {

    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
  const ambassadors = [
    {
      name: "Nguyễn Bình An",
      title: "Diễn viên điện ảnh Việt Nam",
      image: binhan,
    },
    {
      name: "Dương Quốc Hoàng",
      title: "Cơ thủ Bi-a số 1 Việt Nam",
      image: hoangsao,
    },
    {
      name: "Đỗ Kim Phúc",
      title: "Nhà Vô Địch tăng bóng nghệ thuật",
      image: dokimphuc,
    },
    {
      name: "Phạm Văn Đức",
      title: "Đội tuyển Quốc gia Việt Nam",
      image: phanvanduc,
    },
    {
        name: "Thành Chung",
        title: "Đội tuyển Quốc gia Việt Nam",
        image: thanhchung,
      },
      {
        name: "Tấn Tài",
        title: "Đội tuyển Quốc gia Việt Nam",
        image: tantai,
      },
      {
        name: "Tiến Linh",
        title: "Đội tuyển Quốc gia Việt Nam",
        image: tienlinh,
      },
    
  ];

  const handleScroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth;
      if (direction === 'right') {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX);
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="brand-ambassadors">
      <h2 className="brand-ambassadors__main-title">SAO TỎA SÁNG</h2>
      <p className="brand-ambassadors__subtitle">Đồng hành cùng Sao - Sẵn sàng tỏa sáng</p>
      <div className="brand-ambassadors__container">
        <button 
          className="brand-ambassadors__scroll-button brand-ambassadors__scroll-button--left" 
          onClick={() => handleScroll('left')}
        >
          &lt;
        </button>
        <div 
          className="brand-ambassadors__scroll-container" 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {ambassadors.map((ambassador, index) => (
            <div key={index} className="brand-ambassadors__card">
              <img
                src={ambassador.image}
                alt={ambassador.name}
                className="brand-ambassadors__image"
                draggable="false"
              />
              <h3 className="brand-ambassadors__name">{ambassador.name}</h3>
              <p className="brand-ambassadors__role">{ambassador.title}</p>
            </div>
          ))}
        </div>
        <button 
          className="brand-ambassadors__scroll-button brand-ambassadors__scroll-button--right" 
          onClick={() => handleScroll('right')}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default BrandAmbassadors;