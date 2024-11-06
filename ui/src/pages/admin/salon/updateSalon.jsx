import React, { useEffect } from 'react';
import { Button, Input, Modal, notification, Select } from "antd";
import { getAll, switchStatus, update } from '../services/salonService';
import styles from './updateSalon.module.css';
import { Form } from 'antd';

const UpdateSalonForm = ({ visible, onCancel, onSuccess, initialValues, handleSwitchStatus }) => {
  const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                open: initialValues.open,
                id: initialValues.id,
                address: initialValues.address,
                district: initialValues.district,
                hotline: initialValues.hotline,
                image: initialValues.image
            });
        }
    }, [visible, initialValues, form]);

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

  const checkUniqueHotline = async (hotline, currentId = initialValues.id) => {
    try {
        const response = await getAll();
        const salons = response.data.result;

        // Kiểm tra nếu hotline trùng với bất kỳ hotline nào đã tồn tại trong salon khác
        const isUnique = !salons.some(salon => salon.hotline === hotline && salon.id !== currentId);

        return isUnique;
    } catch (error) {
        console.error("Error checking unique hotline:", error);
        return false;
    }
  };


  return (
    <Modal
      title="Cập Nhật Chi Nhánh"
      open={visible}
      onCancel={onCancel}
      footer={null}
      className={styles.updateSalonModal}
      destroyOnClose={true}
    >
      <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
      >
          <Form.Item
              label="ID"
              name="id"
          >
              <Input disabled />
          </Form.Item>

          <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
              <Input />
          </Form.Item>

          <Form.Item
            label="Quận"
            name="district"
            rules={[{ required: true, message: 'Vui lòng chọn chi nhánh!' }]}
          >
            <Select placeholder="Quận">
                <Select.Option label="1" value="1">1</Select.Option>
                <Select.Option label="3" value="3">3</Select.Option>
                <Select.Option label="4" value="4">4</Select.Option>
                <Select.Option label="5" value="5">5</Select.Option>
                <Select.Option label="6" value="6">6</Select.Option>
                <Select.Option label="7" value="7">7</Select.Option>
                <Select.Option label="8" value="8">8</Select.Option>
                <Select.Option label="10" value="10">10</Select.Option>
                <Select.Option label="11" value="11">11</Select.Option>
                <Select.Option label="12" value="12">12</Select.Option>
                <Select.Option label="Tân Bình" value="Tân Bình">Tân Bình</Select.Option>
                <Select.Option label="Tân Phú" value="Tân Phú">Tân Phú</Select.Option>
                <Select.Option label="Bình Tân" value="Bình Tân">Bình Tân</Select.Option>
                <Select.Option label="Gò Vấp" value="Gò Vấp">Gò Vấp</Select.Option>
                <Select.Option label="Phú Nhuận" value="Phú Nhuận">Phú Nhuận</Select.Option>
                <Select.Option label="Bình Thạnh" value="Bình Thạnh">Bình Thạnh</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
              label="Hotline"
              name="hotline"
              rules={[
                  { required: true, message: 'Vui lòng nhập số hotline!' },
                  { 
                      pattern: /^(84|0[3|5|7|8|9])+\d{8}\b/, 
                      message: 'Số điện thoại không hợp lệ!' 
                  },
                  { 
                      validator: async (_, value) => {
                          const isUnique = await checkUniqueHotline(value, initialValues.id); // Implement this function
                          if (!isUnique) {
                              return Promise.reject(new Error('Số hotline đã tồn tại!'));
                          }
                      }
                  }
              ]}
          >
              <Input />
          </Form.Item>

          <Form.Item
              label="Đường dẫn hình ảnh (URL)"
              name="image"
              rules={[{ required: true, message: 'Vui lòng nhập URL!' }]}
          >
              <Input />
          </Form.Item>

          <div className={styles.modalActions}>
              <Button 
                  color="primary"
                  variant='outlined'
                  htmlType="submit"
                  className={styles.actionButton}
              >
                  Cập nhật
              </Button>

              <Button color={initialValues?.open ? 'danger' : 'primary'} 
                      variant="outlined"
                      onClick={() => handleSwitchStatus(initialValues?.id)}
                      className={styles.actionButton}
              >
                {initialValues?.open ? 'Đóng cửa' : 'Mở cửa'}
              </Button>
          </div>
      </Form>
    </Modal>
  );
}

export default UpdateSalonForm;
