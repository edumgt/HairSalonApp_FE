import React from 'react';
import { useParams } from 'react-router-dom';
import { serviceDetails } from '../../../data/serviceDetails';
import './index.scss';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const service = serviceDetails[serviceId];

  if (!service) {
    return <div>Không tìm thấy dịch vụ</div>;
  }

  return (
    <div className="service-detail">
      <h1 className="service-detail__title">QUY TRÌNH DỊCH VỤ</h1>
      <p className="service-detail__subtitle">{service.title} - {service.description}</p>
      <div className="service-detail__steps">
        {service.steps.map((step, index) => (
          <div key={index} className="service-detail__step">
            <img src={step.image} alt={step.name} />
            <p>{step.name}</p>
          </div>
        ))}
      </div>
      <button className="service-detail__book-button">ĐẶT LỊCH NGAY</button>
    </div>
  );
};

export default ServiceDetail;