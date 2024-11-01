import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
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
  onUpdateQuantity,
  totalPrice,
  onConfirm
}) => {
  const handleConfirm = () => {
    onConfirm(selectedServices, selectedCombos, totalPrice);
    onClose();
  };

  const handleQuantityChange = (service, newQuantity, isCombo = false) => {
    if (newQuantity >= 1 && newQuantity <= 3) {
      onUpdateQuantity(service, newQuantity, isCombo);
    }
  };

  return (
    <Modal
      title="Dịch vụ đã chọn"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>Xác nhận</Button>
      ]}
      width={800}
    >
      <div className="selected-services-list">
        {selectedServices.length > 0 && (
          <>
            <h3>Dịch vụ đơn lẻ:</h3>
            {selectedServices.map((service) => (
              <div key={service.id || service.serviceId} className="selected-service-item">
                <span className="service-name">{service.name || service.serviceName}</span>
                <div className="quantity-control">
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() => handleQuantityChange(service, (service.quantity || 1) - 1)}
                    disabled={(service.quantity || 1) <= 1}
                  />
                  <span className="quantity-display">{service.quantity || 1}</span>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleQuantityChange(service, (service.quantity || 1) + 1)}
                    disabled={(service.quantity || 1) >= 3}
                  />
                </div>
                <span className="service-price">{formatPrice(service.price * (service.quantity || 1))}</span>
                <Button onClick={() => onRemoveService(service)} type="link" danger>
                  Xóa
                </Button>
              </div>
            ))}
          </>
        )}

        {selectedCombos.length > 0 && (
          <>
            <h3>Combo đã chọn:</h3>
            {selectedCombos.map((combo) => (
              <div key={combo.id || combo.serviceId} className="selected-combo-item">
                <div className="combo-header">
                  <span className="combo-name">{combo.name || combo.serviceName}</span>
                  <div className="quantity-control">
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() => handleQuantityChange(combo, (combo.quantity || 1) - 1, true)}
                      disabled={(combo.quantity || 1) <= 1}
                    />
                    <span className="quantity-display">{combo.quantity || 1}</span>
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => handleQuantityChange(combo, (combo.quantity || 1) + 1, true)}
                      disabled={(combo.quantity || 1) >= 3}
                    />
                  </div>
                  <span className="combo-price">{formatPrice(combo.price * (combo.quantity || 1))}</span>
                  <Button onClick={() => onRemoveCombo(combo)} type="link" danger>
                    Xóa Combo
                  </Button>
                </div>
                <ul className="combo-services">
                  {combo.services && combo.services.map((service) => (
                    <li key={service.id || service.serviceId} className="combo-service-item">
                      <span>{service.name || service.serviceName}</span>
                      <div className="service-actions">
                        <span>{formatPrice(service.price)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}

        <div className="total-price">
          <strong>Tổng cộng: {formatPrice(totalPrice)}</strong>
        </div>
      </div>
    </Modal>
  );
};

export default SelectedServicesModal;
