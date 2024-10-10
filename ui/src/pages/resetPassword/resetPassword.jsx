import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      message.error('Token không hợp lệ');
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/auth/reset-password', 
        {
          newPassword: values.newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token // Gửi token trực tiếp
          },
          timeout: 10000
        }
      );

      if (response.data.code === 200) {
        message.success('Mật khẩu đã được đặt lại thành công!');
        navigate('/login');
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra khi đặt lại mật khẩu.');
      }
    } catch (error) {
      console.error('Error details:', error);
      if (error.response) {
        message.error(`Lỗi server: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        message.error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        message.error(`Lỗi: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '0 auto' }}>
      <h2>Đặt lại mật khẩu</h2>
      <Form
        form={form}
        name="reset_password"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu mới"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Hai mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Xác nhận mật khẩu mới"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
