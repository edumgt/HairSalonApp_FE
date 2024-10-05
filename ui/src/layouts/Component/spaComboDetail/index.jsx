import React from 'react';
import { useParams } from 'react-router-dom';
import { spaComboDetail } from '../../../data/spaComboDetail';
import './index.scss';

const SpaComboDetail = () => {
  const { comboId } = useParams();
  const combo = spaComboDetail[comboId];

  if (!combo) {
    return <div>Không tìm thấy dịch vụ spa</div>;
  }

  return (
    <div className="spa-combo-detail">
      <h1 className="spa-combo-detail__title">QUY TRÌNH DỊCH VỤ</h1>
      <p className="spa-combo-detail__subtitle">{combo.title} - {combo.description}</p>
      <div className="spa-combo-detail__steps">
        {combo.steps.map((step, index) => (
          <div key={index} className="spa-combo-detail__step" >
            <img src={step.image} alt={step.name} />
            <p className="spa-combo-detail__step-name">{step.name}</p>
            <p className="spa-combo-detail__step-price">{step.price}</p>
            <p className="spa-combo-detail__step-duration">{step.duration}</p>
          </div>
        ))}
      </div>
      <button className="spa-combo-detail__book-button">ĐẶT LỊCH NGAY</button>
    </div>
  );
};

export default SpaComboDetail;