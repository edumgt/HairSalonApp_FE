import React, { useState, useEffect } from 'react';
import { Modal, notification, Button, Form, Select, Input } from "antd";
import { update } from '../services/managerService';
import axios from 'axios';
import styles from './updateManager.module.css';

const { Option } = Select;

const UpdateManagerForm = ({ visible, onCancel, onSuccess, initialValues, onDelete }) => {
  const [form] = Form.useForm();
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
      form.setFieldsValue({
        id: initialValues?.id,
        salonId: initialValues?.staff?.salons?.id
      });
    }
  }, [visible, initialValues, form]);

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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
      >
        <Form.Item
          name="id"
          label="ID"
        >
          <Input disabled value={initialValues?.id} />
        </Form.Item>

        <Form.Item
          name="salonId"
          label="Chi nhánh"
          rules={[{ required: true, message: 'Vui lòng chọn chi nhánh!' }]}
        >
          <Select placeholder="Chọn chi nhánh">
            {availableSalons.map(salon => (
              <Option key={salon.id} value={salon.id}>
                {`${salon.id} - ${salon.address} (Quận ${salon.district})`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className={styles.modalActions}>
          <Button 
            color="primary"
            variant="outlined"
            htmlType="submit"
            className={styles.actionButton}
          >
            Cập nhật
          </Button>

          <Button 
            color="danger"
            variant="outlined"
            onClick={() => {
              onCancel();
              onDelete(initialValues?.id);
            }}
            className={styles.actionButton}
          >
            Hạ chức
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default UpdateManagerForm;
