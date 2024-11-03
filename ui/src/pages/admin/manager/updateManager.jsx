import React, { useState, useEffect } from 'react';
import { Modal, notification } from "antd";
import CUForm from "../../../layouts/admin/components/formv2/form";
import { update } from '../services/managerService';
import axios from 'axios';
import styles from './updateManager.module.css';

const UpdateManagerForm = ({ visible, onCancel, onSuccess, initialValues }) => {
  const [availableSalons, setAvailableSalons] = useState([]);

  useEffect(() => {
    const fetchAvailableSalons = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/salon', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data && response.data.code === 0) {
          // Thêm salon hiện tại của manager vào danh sách (nếu có)
          const currentSalon = initialValues?.staff?.salons;
          const salons = response.data.result;
          if (currentSalon) {
            const isCurrentSalonIncluded = salons.some(salon => salon.id === currentSalon.id);
            if (!isCurrentSalonIncluded) {
              salons.push(currentSalon);
            }
          }
          setAvailableSalons(salons);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách salon:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể lấy danh sách salon có sẵn'
        });
      }
    };

    if (visible) {
      fetchAvailableSalons();
    }
  }, [visible, initialValues]);

  const inputs = [
    {
      label: 'ID',
      name: 'id',
      isInput: true,
      isDisabled: true,
    },
    {
      label: 'Chi nhánh',
      name: 'salonId',
      isSelect: true,
      options: availableSalons.map(salon => ({
        label: `${salon.id} - ${salon.address} (Quận ${salon.district})`,
        value: salon.id
      })),
      rules: [{required: true, message: 'Chi nhánh không được bỏ trống'}],
    }
  ];

  const handleUpdate = async (values) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có muốn cập nhật quản lý này ?',
      onOk: async () => {
        try {
          const response = await update(values);
          notification.success({
            message: 'Thành công',
            description: 'Quản lý đã được cập nhật!',
            duration: 2
          });
          onCancel();
          onSuccess();
          return response;
        } catch (error) {
          console.error(error);
          notification.error({
            message: 'Thất bại',
            description: error.response?.data?.message || 'Cập nhật quản lý thất bại!',
            duration: 2
          });
        }
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };

  return (
    <Modal
      title="Cập Nhật Quản Lý"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      bodyStyle={{ height: '400px' }}
      className={styles.updateManagerModal}
      destroyOnClose={true}
    >
      <CUForm 
        inputs={inputs} 
        handleSave={handleUpdate} 
        initialValues={{
          id: initialValues?.id,
          salonId: initialValues?.staff?.salons?.id
        }}
      />
    </Modal>
  );
}

export default UpdateManagerForm;
