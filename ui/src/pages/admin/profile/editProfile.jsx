import React from 'react';
import { Button, Form, Input, Layout, Modal, Space, message } from 'antd';
import { Content } from 'antd/es/layout/layout';
import styles from './editProfile.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { update } from '../services/profileService';
import NavLink from '../../../layouts/admin/components/link/navLink';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;
  const [form] = Form.useForm();

  const initialValues = {
    id: profile?.id,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
    role: profile?.role,
    email: profile?.email,
    phone: profile?.phone,
  };

  const editProfile = async (values) => {
    Modal.confirm({
      title: 'Xác nhận cập nhật thông tin',
      content: 'Bạn có chắc chắn muốn cập nhật thông tin cá nhân?',
      onOk: async () => {
        try {
          const response = await update(values);
          if (response.data && response.data.code === 200) {
            message.success('Cập nhật thông tin thành công');
            navigate('/admin/adminprofile', { state: { shouldReload: true } });
          } else {
            throw new Error(response.data?.message || 'Cập nhật thất bại');
          }
        } catch (error) {
          console.error('Error updating profile:', error);
          message.error(error.message || 'Đã xảy ra lỗi khi cập nhật thông tin');
        }
      },
    });
  };

  const handleCancel = () => {
    navigate('/admin/adminprofile');
  };

  return (
    <>
    <NavLink currentPage="Chỉnh sửa thông tin cá nhân" />
    <Layout className={styles.layout}>
      <div className={styles.bg}>
        <div className={styles.header}>Chỉnh sửa thông tin cá nhân</div>
        <Content className={styles.content}>
          <Form
            {...formItemLayout}
            form={form}
            initialValues={initialValues}
            onFinish={editProfile}
            className={styles.form}
          >
            <Form.Item
              label="ID"
              name="id"
              rules={[{ required: true, message: 'Vui lòng nhập ID!' }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Họ"
              name="firstName"
              rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tên"
              name="lastName"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: 'Vui lòng nhập vai trò!' }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { min: 10, message: 'Số điện thoại phải có ít nhất 10 chữ số!' },
                { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ được chứa số!' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item className={styles.buttonGroup}>
              <Space>
                <Button type="primary" htmlType="submit">
                  Cập nhật thông tin
                </Button>
                <Button type="default" onClick={handleCancel}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Content>
      </div>
    </Layout>
    </>
  );
};

export default EditProfile;
