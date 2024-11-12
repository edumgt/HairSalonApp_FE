import React, { useEffect, useState } from 'react';
import { Modal, notification, Button, Form, Input, Select } from "antd";
import { getServices, update } from "../services/comboService";
import styles from './updateCombo.module.css';

const { Option } = Select;

const UpdateComboForm = ({ visible, onCancel, onSuccess, initialValues, onDelete }) => {
  const [form] = Form.useForm();
  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await getServices();
        const services = response.data.result.map(service => ({
          label: service.serviceName,  
          value: service.serviceId     
        }));
        setServiceOptions(services);
      } catch (error) {
        console.error("Error loading services:", error);
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        id: initialValues.id,
        name: initialValues.name,
        services: initialValues.services?.map(service => service.serviceId),
        description: initialValues.description
      });
    }
  }, [visible, initialValues, form]);

  const handleUpdate = async (values) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có muốn cập nhật combo này ?',
      onOk: async () => {
        try {
          const response = await update(values);
          notification.success({
            message: 'Thành công',
            description: 'Combo đã được cập nhật!',
            duration: 2
          });
          onCancel();
          onSuccess();
          return response;
        } catch (error) {
          console.error(error);
          notification.error({
            message: 'Thất bại',
            description: error.response?.data?.message || 'Cập nhật combo thất bại!',
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
      title="Cập Nhật Combo"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      bodyStyle={{ height: '400px' }}
      className={styles.updateComboModal}
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
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên Combo"
          rules={[{ required: true, message: 'Vui lòng nhập tên combo!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="services"
          label="Các dịch vụ"
          rules={[
            { 
              required: true, 
              message: 'Vui lòng chọn ít nhất 2 dịch vụ!',
              validator: (_, selectedOptions) => {
                if (!selectedOptions || selectedOptions.length < 2) {
                  return Promise.reject('Bạn phải chọn ít nhất 2 dịch vụ');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn dịch vụ"
            onChange={setSelectedOptions}
          >
            {serviceOptions.map(service => (
              <Option key={service.value} value={service.value}>
                {service.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input.TextArea />
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
            Xóa
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateComboForm;