import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './Login.css';

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  //lưu cả token và số điện thoại
  const saveUserData = (token, phoneNumber) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userPhone', phoneNumber);
    window.dispatchEvent(new Event('login'));
  };

  const handleLogin = async (values) => {
    const { username, password } = values;
    
    const loginData = {
      username,
      password
    };

    console.log('Dữ liệu đăng nhập:', loginData);

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
        saveUserData(data.result.token, username); // Lưu token và số điện thoại
        window.dispatchEvent(new Event('login'));
        message.success({
          content: 'Đăng nhập thành công!',
          icon: <CheckCircleOutlined />,
          duration: 2,
          style: {
            marginTop: '20vh',
          },
        });
        setTimeout(() => navigate('/home'), 2000);
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
    }
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <h2>Đăng nhập</h2>
        <Form form={form} className="loginForm" onFinish={handleLogin}>
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

          <button type="submit" className="loginButton">Đăng nhập</button>
        </Form>
        <Link to="/forgot-password" className="forgetPasswordLink">Quên mật khẩu?</Link>
        <div className="divider"></div>
        <p className="socialLoginText">Hoặc đăng nhập bằng:</p>
        <div className="socialLogin">
          <button onClick={() => console.log('Đăng nhập bằng Google')} className="googleLogin">
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
          </button>
          <button onClick={() => console.log('Đăng nhập bằng Facebook')} className="facebookLogin">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>
        <p className="signupLink">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;