import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams();
  var getToken = searchParams.get('token');
  if (getToken) {
    localStorage.setItem('resetPasswordToken', getToken);
  }

  useEffect(() => {
    const token = localStorage.getItem('resetPasswordToken');
    if (!token) {
      message.error('Không tìm thấy thông tin xác thực. Vui lòng thử lại từ đầu.');
      navigate('/forgot-password');
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('resetPasswordToken');
      if (!token) {
        throw new Error('Không tìm thấy thông tin xác thực.');
      }

      const response = await axios.post(
        'http://localhost:8080/api/v1/auth/reset-password', 
        {
          newPassword: values.newPassword,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        message.success('Mật khẩu đã được đặt lại thành công!');
        localStorage.removeItem('resetPasswordToken');
        navigate('/login');
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra khi đặt lại mật khẩu.');
      }
    } catch (error) {
      console.error('Chi tiết lỗi:', error);
      // ... (phần xử lý lỗi giữ nguyên)
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