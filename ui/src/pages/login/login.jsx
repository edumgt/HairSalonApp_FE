import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, message, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './login.css';

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const saveUserData = (token, username, userRole, firstName, lastName) => {
    console.log('Saving user data:', { token, username, userRole, firstName, lastName });
    localStorage.setItem('token', token || '');
    localStorage.setItem('username', username || '');
    localStorage.setItem('userRole', userRole || '');
    localStorage.setItem('firstName', firstName || '');
    localStorage.setItem('lastName', lastName || '');
    
    // Dispatch event với dữ liệu đã lưu
    window.dispatchEvent(new CustomEvent('login', { 
      detail: { 
        role: userRole || '',
        firstName: firstName || '',
        lastName: lastName || '',
      } 
    }));
  };

  const handleLogin = async (values) => {
    const { username, password } = values;

    const loginData = {
      username,
      password
    };

    console.log('Dữ liệu đăng nhập:', loginData);
    setIsLoggingIn(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Full login response:', data);
        if (data.result && data.result.token) {
          try {
            const profileResponse = await fetch('http://localhost:8080/api/v1/profile/', {
              headers: { 'Authorization': `Bearer ${data.result.token}` }
            });
            const profileData = await profileResponse.json();
            
            console.log('Profile data:', profileData);
    
            if (profileResponse.ok && profileData.result) {
              const userRole = profileData.result.role || '';
              const firstName = profileData.result.firstName || '';
              const lastName = profileData.result.lastName || '';

              saveUserData(data.result.token, username, userRole, firstName, lastName);
              
              message.success({
                content: 'Đăng nhập thành công!',
                icon: <CheckCircleOutlined />,
                duration: 2,
                style: { marginTop: '20vh' },
              });
              
              setTimeout(() => {
                navigate('/home');
              }, 2000);
            } else {
              console.error('Failed to fetch profile data or invalid data structure');
              message.error('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
            }
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            message.error('Có lỗi xảy ra khi lấy thông tin người dùng. Vui lòng thử lại sau.');
          }
        } else {
          console.error('Missing required data in login response:', data);
          message.error('Đăng nhập thất bại: Dữ liệu không hợp lệ từ server');
        }
      } else {
        console.error('Đăng nhập thất bại:', data);
        let errorMessage = 'Vui lòng kiểm tra lại thông tin đăng nhập';
        if (data.message) {
          errorMessage = data.message;
        } else if (response.status === 403) {
          errorMessage = 'Không có quyền truy cập. Vui lòng kiểm tra lại thông tin đăng nhập hoặc liên hệ quản trị viên.';
        }
        message.error({
          content: `Đăng nhập thất bại: ${errorMessage}`,
          icon: <CloseCircleOutlined />,
          duration: 3,
          style: {
            marginTop: '20vh',
          },
        });
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      message.error({
        content: `Lỗi khi đăng nhập: ${error.message || 'Vui lòng thử lại sau'}`,
        icon: <CloseCircleOutlined />,
        duration: 3,
        style: {
          marginTop: '20vh',
        },
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <h2>Đăng nhập</h2>
        <Form form={form} className="loginForm" onFinish={handleLogin} layout='vertical'>
          <Space direction='vertical'>
          <Form.Item
            name="username"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <input
              type="text"
              className="loginInput"
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="loginInput"
                placeholder="Nhập mật khẩu"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <div className="rememberMe">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Ghi nhớ đăng nhập</label>
            </div>
          </Form.Item>

          <button type="submit" className="loginButton" disabled={isLoggingIn}>
            {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          </Space>
        </Form>
        <Link to="/forgot-password" className="forgetPasswordLink">Quên mật khẩu?</Link>
        <div className="divider"></div>
        <p className="signupLink">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;