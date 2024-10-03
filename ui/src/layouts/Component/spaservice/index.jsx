import React from "react";
import { Card, Button } from "antd";
import "./index.scss";
// Import hình ảnh
import massageImage from "../../../assets/imageHome/Service/pc_home_spa_1.png";
import earCleaningImage from "../../../assets/imageHome/Service/pc_home_spa_3.png";
import faceCleaningImage from "../../../assets/imageHome/Service/cao-long-mat.png";
const { Meta } = Card;

const SpaServices = () => {
  const services = [
    {
      title: "Gội Massage Relax",
      image: massageImage,
      description: "Tìm hiểu thêm >",
      link: "#",
    },
    {
      title: "Lấy ráy tai êm",
      image: earCleaningImage,
      description: "Tìm hiểu thêm >",
      link: "#",
    },
    {
      title: "Cạo mặt dưỡng da",
      image: faceCleaningImage,
      description: "Tìm hiểu thêm >",
      link: "#",
    },
  ];

  return (
    <div className="spa-services">
      <h2 className="spa-services__title">SPA & RELAX</h2>
      <div className="spa-services__grid">
        {services.map((service, index) => (
          <div key={index} className="spa-services__card">
            <img
              src={service.image}
              alt={service.title}
              className="spa-services__image"
            />
            <h3 className="spa-services__card-title">{service.title}</h3>
            {service.price && (
              <p className="spa-services__price">Giá từ {service.price}</p>
            )}
            <a href={service.link} className="spa-services__link">
              Tìm hiểu thêm &gt;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpaServices;
