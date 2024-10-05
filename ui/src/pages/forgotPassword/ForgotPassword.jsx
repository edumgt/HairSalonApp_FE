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
    <div className="forget-password-container">
      <h2>Quên mật khẩu</h2>
      <form className="forget-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="forget-password-input"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="forget-password-button">Gửi yêu cầu đặt lại mật khẩu</button>
      </form>
      <div className="divider"></div>
      <Link to="/login" className="back-to-login">Quay lại trang đăng nhập</Link>
    </div>
  );
}

export default ForgotPassword;