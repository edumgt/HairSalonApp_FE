import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Gửi yêu cầu đặt lại mật khẩu cho:', email);
  };

  return (
    <div className="forgot-password-page">
    <div className="forgetPasswordContainer">
      <h2>Quên mật khẩu</h2>
      <form className="forgetPasswordForm" onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="forgetPasswordInput"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
          <button type="submit" className="forgetPasswordButton">Gửi yêu cầu đặt lại mật khẩu</button>
      </form>
      <div className="divider"></div>
      <Link to="/login" className="backToLogin">Quay lại trang đăng nhập</Link>
    </div>
    </div>
  );
}

export default ForgotPassword;