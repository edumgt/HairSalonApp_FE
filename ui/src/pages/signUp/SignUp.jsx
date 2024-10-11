import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate vào đây
import { Form } from 'antd'; // Thêm import này
import './SignUp.css';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); 
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('STAFF');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form] = Form.useForm(); // Thêm dòng này

  const navigate = useNavigate(); // Thêm dòng này

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSignUp = async (values) => {
    const { firstName, lastName, email, phone, password, confirmPassword } = values;

    if (!validateEmail(email)) {
      setEmailError('Địa chỉ email không hợp lệ');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }

    const userData = {
      phone,
      password,
      firstName,
      lastName,
      email,
      role
    };

    console.log('Dữ liệu đăng ký:', userData);

    try {
      console.log('Đang gửi yêu cầu đăng ký...');
      
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi đăng ký');
      }

      console.log('Đăng ký thành công!', data);
      alert('Đăng ký thành công!');
      
      // Chuyển hướng đến trang đăng nhập
      navigate('/login');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert(`Đăng ký thất bại: ${error.message}`);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Đăng ký</h2>
        <Form form={form} className="signup-form" onFinish={handleSignUp}>
          <div className="form-group name-group">
            <div className="name-input">
              <Form.Item
                name="firstName"
                label="Họ"
                rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
              >
                <input
                  type="text"
                  className="signup-input"
                  placeholder="Nhập họ"
                />
              </Form.Item>
            </div>
            <div className="name-input">
              <Form.Item
                name="lastName"
                label="Tên"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              >
                <input
                  type="text"
                  className="signup-input"
                  placeholder="Nhập tên"
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <input
              type="email"
              className={`signup-input ${emailError ? 'input-error' : ''}`}
              placeholder="Nhập email của bạn"
            />
          </Form.Item>
          {emailError && <span className="error-message">{emailError}</span>}

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <input
              type="text"
              className="signup-input"
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
                className="signup-input"
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
          <small>Sử dụng 8 ký tự trở lên kết hợp chữ cái, số và ký tự đặc biệt</small>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp'));
                },
              }),
            ]}
          >
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="signup-input"
                placeholder="Nhập lại mật khẩu"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  {showConfirmPassword ? (
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

          <Form.Item
            name="acceptTerms"
            valuePropName="checked"
            rules={[
              { required: true, message: 'Vui lòng đồng ý với điều khoản và chính sách' }
            ]}
          >
            <div className="form-group checkbox-group">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">Tôi đồng ý với các điều khoản và chính sách bảo mật</label>
            </div>
          </Form.Item>

          <button type="submit" className="signup-button">Đăng ký</button>
        </Form>
        <div className="divider"></div>
        <p className="social-signup-text">Hoặc đăng ký bằng:</p>
        <div className="social-signup">
          <button onClick={() => console.log('Đăng ký bằng Facebook')} className="facebook-signup">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button onClick={() => console.log('Đăng ký bằng Google')} className="google-signup">
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
          </button>
        </div>
        <p className="login-link">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
      </div>
    </div>
  );
}

export default SignUp;