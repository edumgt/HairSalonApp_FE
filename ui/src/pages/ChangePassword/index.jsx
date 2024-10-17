import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import './index.scss';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/password/change', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
        }
      });

      if (response.status === 200) {
        message.success('Mật khẩu đã được thay đổi thành công!');
        form.resetFields();
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Có lỗi xảy ra khi thay đổi mật khẩu.');
      } else {
        message.error('Có lỗi xảy ra khi kết nối với server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Đổi mật khẩu</h2>
      <Form
        form={form}
        name="changePassword"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="oldPassword"
          label="Mật khẩu hiện tại"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu hiện tại!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu mới!',
            },
            {
              min: 6,
              message: 'Mật khẩu phải có ít nhất 6 ký tự!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={['newPassword']}
          rules={[
            {
              required: true,
              message: 'Vui lòng xác nhận mật khẩu mới!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;