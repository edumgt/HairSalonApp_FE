import React from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './index.scss';

const SelectedServicesModal = ({ visible, onClose, selectedServices, onRemoveService, totalPrice }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      title="Dịch vụ đã chọn"
    >
      <div className="selected-services-list">
        {selectedServices.map((service, index) => (
          <div key={index} className="selected-service-item">
            <span>{service.title}</span>
            <span>{service.price}</span>
            <CloseOutlined onClick={() => onRemoveService(index)} />
          </div>
        ))}
      </div>
      <div className="total-price">
        <span>Tổng thanh toán</span>
        <span>{totalPrice.toLocaleString()} VND</span>
      </div>
    </Modal>
  );
};

export default SelectedServicesModal;