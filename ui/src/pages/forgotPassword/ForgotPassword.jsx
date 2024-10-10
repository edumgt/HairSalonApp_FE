import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import axios from 'axios';

function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [showResetLink, setShowResetLink] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setShowResetLink(false);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/forgot-password', {
        phone: phone
      });

      if (response.status === 200) {
        setMessage('Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.');
        setShowResetLink(true);
        setResetToken(response.data.token); // Giả sử backend trả về token trong response
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('Số điện thoại không tồn tại trong hệ thống.');
      } else {
        setMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
      console.error('Lỗi khi gửi yêu cầu:', error);
    }
  };

  const handleGoToResetPage = () => {
    navigate(`/reset-password?token=${resetToken}`);
  };

  return (
    <div className="forgot-password-page">
      <div className="forgetPasswordContainer">
        <h2>Quên mật khẩu</h2>
        <form className="forgetPasswordForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              className="forgetPasswordInput"
              placeholder="Nhập số điện thoại của bạn"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="forgetPasswordButton">Gửi yêu cầu đặt lại mật khẩu</button>
        </form>
        {message && <p className="message">{message}</p>}
        
        <div className="divider"></div>
        <Link to="/login" className="backToLogin">Quay lại trang đăng nhập</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;