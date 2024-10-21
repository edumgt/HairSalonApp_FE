import React from 'react';
import { Modal, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './index.scss';

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });
};

const SelectedServicesModal = ({ 
  visible, 
  onClose, 
  selectedServices = [],
  selectedCombos = [], 
  onRemoveService,
  onRemoveCombo,
  onRemoveServiceFromCombo,
  totalPrice 
}) => {
  return (
    <Modal
      title="Dịch vụ đã chọn"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <div className="selected-services-list">
        <h3>Dịch vụ đơn lẻ:</h3>
        {selectedServices.map((service) => (
          <div key={service.id || service.serviceId} className="selected-service-item">
            <span>{service.name || service.serviceName}</span>
            <span>{formatPrice(service.price)}</span>
            <Button onClick={() => onRemoveService(service)} type="link" danger>
              Xóa
            </Button>
          </div>
        ))}

        <h3>Combo đã chọn:</h3>
        {selectedCombos.map((combo) => (
          <div key={combo.id || combo.serviceId} className="selected-combo-item">
            <div className="combo-header">
              <span>{combo.name || combo.serviceName}</span>
              <span>{formatPrice(combo.price)}</span>
              <Button onClick={() => onRemoveCombo(combo)} type="link" danger>
                Xóa Combo
              </Button>
            </div>
            <ul className="combo-services">
              {combo.services && combo.services.map((service) => (
                <li key={service.id || service.serviceId} className="combo-service-item">
                  <span>{service.name || service.serviceName}</span>
                  <span>{formatPrice(service.price)}</span>
                  <Button 
                    onClick={() => onRemoveServiceFromCombo(combo.id || combo.serviceId, service)} 
                    type="link" 
                    danger
                  >
                    Xóa
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="total-price">
          <strong>Tổng cộng: {formatPrice(totalPrice)}</strong>
        </div>
      </div>
    </Modal>
  );
};

export default SelectedServicesModal;