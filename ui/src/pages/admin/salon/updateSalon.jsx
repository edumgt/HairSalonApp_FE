import React from 'react';
import { Modal, notification } from "antd";
import CUForm from "../../../layouts/admin/components/formv2/form";
import { update } from '../services/salonService';
import styles from './updateSalon.module.css';

const UpdateSalonForm = ({ visible, onCancel, onSuccess, initialValues }) => {
  const inputs = [
    {
      label: 'ID',
      name: 'id',
      isInput: true,
      isDisabled: true,
    },
    {
      label: 'Địa chỉ',
      name: 'address',
      isInput: true,
      rules: [{required: true, message: 'Địa chỉ không được bỏ trống'}],
    },
    {
      label: 'Quận',
      name: 'district',
      isSelect: true,
      options: [
        {label: '1', value: '1'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
        {label: '7', value: '7'},
        {label: '8', value: '8'},
        {label: '10', value: '10'},
        {label: '11', value: '11'},
        {label: '12', value: '12'},
        {label: 'Tân Bình', value: 'Tân Bình'},
        {label: 'Tân Phú', value: 'Tân Phú'},
        {label: 'Bình Tân', value: 'Bình Tân'},
        {label: 'Gò Vấp', value: 'Gò Vấp'},
        {label: 'Phú Nhuận', value: 'Phú Nhuận'},
        {label: 'Bình Thạnh', value: 'Bình Thạnh'}
      ],
      rules: [{required: true, message: 'Quận không được bỏ trống'}],
    }
  ];

  const handleUpdate = async (values) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có muốn cập nhật chi nhánh này ?',
      onOk: async () => {
        try {
          const response = await update(values);
          notification.success({
            message: 'Thành công',
            description: 'Chi nhánh đã được cập nhật!',
            duration: 2
          });
          onCancel();
          onSuccess();
          return response;
        } catch (error) {
          console.error(error);
          notification.error({
            message: 'Thất bại',
            description: error.response?.data?.message || 'Cập nhật chi nhánh thất bại!',
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
      title="Cập Nhật Chi Nhánh"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      bodyStyle={{ height: '400px' }}
      className={styles.updateSalonModal}
      destroyOnClose={true}
    >
      <CUForm 
        inputs={inputs} 
        handleSave={handleUpdate} 
        initialValues={initialValues}
      />
    </Modal>
  );
}

export default UpdateSalonForm;
