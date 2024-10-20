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
  selectedServices, 
  selectedCombos = [], 
  onRemoveService, 
  onRemoveCombo, 
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
        {selectedServices && selectedServices.map((service) => (
          <div key={service.id} className="selected-service-item">
            <span>{service.name || service.serviceName}</span>
            <span>{formatPrice(service.price)}</span>
            <Button onClick={() => onRemoveService(service)} type="link" danger>
              Xóa
            </Button>
          </div>
        ))}

        <h3>Combo đã chọn:</h3>
        {selectedCombos.map((combo) => (
          <div key={combo.id} className="selected-combo-item">
            <span>{combo.name}</span>
            <span>{formatPrice(combo.price)}</span>
            <Button onClick={() => onRemoveCombo(combo)} type="link" danger>
              Xóa
            </Button>
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