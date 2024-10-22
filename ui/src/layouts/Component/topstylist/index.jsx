import React, { useRef, useState, useEffect, useCallback } from "react";
import "./index.scss";
import axios from 'axios';
import moment from 'moment';

const TopStylists = () => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [stylists, setStylists] = useState([]);

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/staff');
        const allStaff = response.data.result;
        const filteredStylists = allStaff.filter(staff => staff.role === "STYLIST");
        setStylists(filteredStylists);
      } catch (error) {
        console.error('Lỗi khi tải danh sách stylist:', error);
      }
    };

    fetchStylists();
  }, []);

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

  return (
    <div className="top-stylists">
      <h2 className="top-stylists__main-title">TOP THỢ CẮT </h2>
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
          {stylists.map((stylist, index) => (
            <div key={index} className="top-stylists__card">
              <img
                src={getImgurDirectUrl(stylist.image)}
                alt={`${stylist.firstName} ${stylist.lastName}`}
                className="top-stylists__image"
                draggable="false"
              />
              <h3 className="top-stylists__name">{`${stylist.firstName} ${stylist.lastName}`}</h3>
              <p className="top-stylists__location">{stylist.address}</p>
              <p className="top-stylists__join-date">
                Tham gia: {moment(stylist.joinIn).format('DD/MM/YYYY')}
              </p>
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