import React, { useRef, useState } from "react";
import "./index.scss";

import news1 from "../../../assets/imageHome/LatestNew/1.png";
import news2 from "../../../assets/imageHome/LatestNew/2.png";
import news3 from "../../../assets/imageHome/LatestNew/3.png";
import news4 from "../../../assets/imageHome/LatestNew/4.png";
import news5 from "../../../assets/imageHome/LatestNew/5.png";
import news6 from "../../../assets/imageHome/LatestNew/6.png";

const LatestNews = () => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const newsItems = [
    {       
      description: "Lần đầu tiên một chuỗi cắt tóc hơn 100 cửa hàng bỏ quy trình bán hàng, quyết không nói với nạn 'upsell', 'bán bia kèm lạc', trong dịch vụ ",
      image: news2,
      link: "https://theleader.vn/30shine-dau-tu-lon-vao-cong-nghe-lam-dep-sau-cu-hich-15-trieu-usd-d6893.html"
    },
    {
      description: "Nước cờ mạo hiểm của 30Shine",
      image: news1,
      link: "https://diendandoanhnghiep.vn/nuoc-co-mao-hiem-cua-30shine-258800.html"
    },
      {
        description: "Bước chuyển mình ở 30Shine sau khi đạt quy mô 101 salon tóc nam",
        image: news4,
        link: "https://vietnambiz.vn/buoc-chuyen-minh-o-30shine-sau-khi-dat-quy-mo-101-salon-toc-nam-20241301221375.htm"
      },
      {
        description: "Chuỗi cắt tóc 30Shine gian nan giải bài toán mở rộng quy mô ngành làm đẹp cho nam giới",
        image: news3,
        link: "https://cafebiz.vn/chuoi-cat-toc-30shine-gian-nan-giai-bai-toan-mo-rong-quy-mo-nganh-lam-dep-cho-nam-gioi-176240130103406331.chn"
      },
      {
        description: "Chiến lược quảng cáo bằng chính nhân viên",
        image: news5,
        link: "https://diendandoanhnghiep.vn/chien-luoc-quang-cao-bang-chinh-nhan-vien-257193.html"
      },
      {
        description: "4 hướng để doanh nghiệp chuỗi giải bài toán tăng trưởng",
        image: news6,
        link: "https://cafebiz.vn/4-huong-de-doanh-nghiep-chuoi-giai-bai-toan-tang-truong-176231031153450692.chn"
      }
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

  const handleCardClick = (link, event) => {
    // Ngăn chặn sự kiện click lan truyền khi click vào nút "Xem chi tiết"
    if (event.target.closest('.latest-news__link')) {
      return;
    }
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleLinkClick = (link, event) => {
    event.preventDefault();
    event.stopPropagation();
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="latest-news">
      <h2 className="latest-news__main-title">TIN TỨC MỚI NHẤT VỀ 30SHINE</h2>
      <p className="latest-news__subtitle">Cập nhật những thông tin mới nhất về 30Shine</p>
      <div className="latest-news__container">
        <button 
          className="latest-news__scroll-button latest-news__scroll-button--left" 
          onClick={() => handleScroll('left')}
        >
          &lt;
        </button>
        <div 
          className="latest-news__scroll-container" 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {newsItems.map((item, index) => (
            <div 
              key={index} 
              className="latest-news__card"
              onClick={(e) => handleCardClick(item.link, e)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="latest-news__image"
                draggable="false"
              />
              <h3 className="latest-news__title">{item.title}</h3>
              <p className="latest-news__description">{item.description}</p>
              <a 
                href={item.link} 
                className="latest-news__link" 
                onClick={(e) => handleLinkClick(item.link, e)}
              >
                Xem chi tiết &gt;
              </a>
            </div>
          ))}
        </div>
        <button 
          className="latest-news__scroll-button latest-news__scroll-button--right" 
          onClick={() => handleScroll('right')}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default LatestNews;