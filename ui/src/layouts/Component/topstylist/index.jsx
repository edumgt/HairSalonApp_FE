import React, { useRef, useState } from "react";
import "./index.scss";
import stylist1 from "../../../assets/imageHome/Stylist/Stylist_1.jpg";
import stylist2 from "../../../assets/imageHome/Stylist/Stylist_2.jpg";
import stylist3 from "../../../assets/imageHome/Stylist/Stylist_3.jpg";
import stylist4 from "../../../assets/imageHome/Stylist/Stylist_4.jpg";
import stylist5 from "../../../assets/imageHome/Stylist/Stylist_5.jpg";
import stylist6 from "../../../assets/imageHome/Stylist/Stylist_6.jpg";
import stylist7 from "../../../assets/imageHome/Stylist/Stylist_7.jpg";
import stylist8 from "../../../assets/imageHome/Stylist/Stylist_8.jpg";
import stylist9 from "../../../assets/imageHome/Stylist/Stylist_9.jpg";

const TopStylists = () => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const stylists = [
    {
      name: "Mạnh Nguyễn",
      location: "80 Trần Phú, Thanh Hóa",
      image: stylist1, 
    },
    {
      name: "Thủy Vũ",
      location: "80 Trần Phú, Thanh Hóa",
      image: stylist2, 
    },
    {
      name: "Hồng Nguyễn",
      location: "80 Trần Phú, Thanh Hóa",
      image: stylist3, 
    },
    {
      name: "Cường Lê",
      location: "11 Phan Kế Toại, Hà Nội",
      image: stylist4, 
    },
    {
        name: "Tuấn Lê",
        location: "11 Phan Kế Toại, Hà Nội",
        image: stylist5, 
      },
      {
        name: "Hồng Nguyễn",
        location: "11 Phan Kế Toại, Hà Nội",
        image: stylist6, 
      },
      {
        name: "Nhân Dương",
        location: "11 Phan Kế Toại, Hà Nội",
        image: stylist7, 
      },
      {
        name: "Binh Sỳ",
        location: "11 Phan Kế Toại, Hà Nội",
        image: stylist8 , 
      },
      {
        name: "Khánh Hồ",
        location: "11 Phan Kế Toại, Hà Nội",
        image: stylist9, 
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
    <div className="top-stylists">
      <h2 className="top-stylists__main-title">TOP THỢ CẮT TRONG THÁNG</h2>
      <p className="top-stylists__subtitle">Đội ngũ Stylist dày dặn kinh nghiệm</p>
      <a href="#" className="top-stylists__view-all">Xem tất cả &gt;</a>
      <div className="top-stylists__container">
        <button 
          className="top-stylists__scroll-button top-stylists__scroll-button--left" 
          onClick={() => handleScroll('left')}
        >
          &lt;
        </button>
        <div 
          className="top-stylists__scroll-container" 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {Array.isArray(stylists) && stylists.map((stylist, index) => (
            <div key={index} className="top-stylists__card">
              <img
                src={stylist.image}
                alt={stylist.name}
                className="top-stylists__image"
                draggable="false"
              />
              <h3 className="top-stylists__name">{stylist.name}</h3>
              <p className="top-stylists__location">{stylist.location}</p>
            </div>
          ))}
        </div>
        <button 
          className="top-stylists__scroll-button top-stylists__scroll-button--right" 
          onClick={() => handleScroll('right')}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default TopStylists;