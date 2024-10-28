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
  // Thêm state cho modal xác nhận
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [serviceToAdd, setServiceToAdd] = useState(null);

  // Thêm hàm getAllServices
  const getAllServices = () => {
    return selectedServices;
  };

  // Thêm hàm tính tổng giá mới
  const calculateNewTotal = (newService) => {
    const servicesTotal = selectedServices.reduce((total, service) => 
      total + (service.price * (service.quantity || 1)), 0);
    
    const combosTotal = selectedCombos.reduce((total, combo) => 
      total + (combo.price * (combo.quantity || 1)), 0);

    const newServicePrice = newService.price * (newService.quantity || 1);
    
    return servicesTotal + combosTotal + newServicePrice;
  };

  // Thêm hàm để kiểm tra xem dịch vụ đã được chọn riêng chưa
  const isServiceSelectedIndividually = (serviceId) => {
    return selectedServices.some(service => 
      (service.id || service.serviceId) === serviceId
    );
  };

  // Sửa lại hàm handleAddServiceFromCombo
  const handleAddServiceFromCombo = (service) => {
    if (!isServiceSelectedIndividually(service.id || service.serviceId)) {
      setServiceToAdd(service);
      setConfirmModalVisible(true);
    }
  };

  // Thêm hàm xử lý xác nhận thêm dịch vụ
  const handleConfirmAddService = () => {
    if (serviceToAdd) {
      const newService = { 
        ...serviceToAdd, 
        quantity: 1,
        isFromCombo: true 
      };
      
      // Tính tổng giá mới bao gồm dịch vụ vừa thêm
      const newTotal = calculateNewTotal(newService);
      
      // Gọi onRemoveService với dịch vụ mới và tổng giá mới
      onRemoveService(newService, newTotal);
      message.success('Đã thêm dịch vụ thành công');
    }
    setConfirmModalVisible(false);
    setServiceToAdd(null);
  };

  const handleConfirm = () => {
    const allServices = getAllServices();
    onConfirm(allServices, selectedCombos, totalPrice);
    onClose();
  };

  // Hàm xử lý thay đổi số lượng
  const handleQuantityChange = (service, newQuantity, isCombo = false) => {
    if (newQuantity >= 1 && newQuantity <= 2) {
      onUpdateQuantity(service, newQuantity, isCombo);
    }
  };

  return (
    <>
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
                  disabled={(service.quantity || 1) >= 2}
                />
              </div>
              <span className="service-price">{formatPrice(service.price * (service.quantity || 1))}</span>
              <Button onClick={() => onRemoveService(service)} type="link" danger>
                Xóa
              </Button>
            </div>
          ))}

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
                    disabled={(combo.quantity || 1) >= 2}
                  />
                </div>
                <span className="combo-price">{formatPrice(combo.price * (combo.quantity || 1))}</span>
                <Button onClick={() => onRemoveCombo(combo)} type="link" danger>
                  Xóa Combo
                </Button>
              </div>
              <ul className="combo-services">
                {combo.services && combo.services.map((service) => {
                  const isSelected = isServiceSelectedIndividually(service.id || service.serviceId);
                  return (
                    <li key={service.id || service.serviceId} className="combo-service-item">
                      <span>{service.name || service.serviceName}</span>
                      <div className="service-actions">
                        <span>{formatPrice(service.price)}</span>
                        <Button
                          icon={<PlusOutlined />}
                          size="small"
                          onClick={() => handleAddServiceFromCombo(service)}
                          disabled={isSelected}
                          title={isSelected ? "Đã thêm dịch vụ này" : "Thêm dịch vụ này"}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="total-price">
            <strong>Tổng cộng: {formatPrice(totalPrice)}</strong>
          </div>
        </div>
      </Modal>

      {/* Thêm Modal xác nhận */}
      <Modal
        title="Xác nhận thêm dịch vụ"
        visible={confirmModalVisible}
        onCancel={() => {
          setConfirmModalVisible(false);
          setServiceToAdd(null);
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setConfirmModalVisible(false);
              setServiceToAdd(null);
            }}
          >
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleConfirmAddService}
          >
            Xác nhận
          </Button>
        ]}
      >
        <p>Bạn có muốn thêm dịch vụ "{serviceToAdd?.name || serviceToAdd?.serviceName}" với giá {formatPrice(serviceToAdd?.price || 0)} không?</p>
      </Modal>
    </>
  );
};

export default SelectedServicesModal;
