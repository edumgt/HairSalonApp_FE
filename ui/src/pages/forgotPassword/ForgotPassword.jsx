import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import axios from 'axios';

function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      console.log('Đang gửi yêu cầu đặt lại mật khẩu...');
      const response = await axios.post('http://localhost:8080/api/v1/auth/forgot-password', {
        phone: phone
      });
      console.log('Phản hồi từ server:', JSON.stringify(response.data, null, 2));

      if (response.status === 200) {
        setMessage('Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn và nhấp vào liên kết để đặt lại mật khẩu.');
      } else {
        throw new Error('Phản hồi không hợp lệ từ server');
      }
    } catch (error) {
      console.error('Chi tiết lỗi:', error);
      if (error.response) {
        console.error('Dữ liệu phản hồi lỗi:', error.response.data);
        console.error('Trạng thái lỗi:', error.response.status);
        switch (error.response.status) {
          case 400:
            setMessage('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.');
            break;
          case 404:
            setMessage('Số điện thoại không tồn tại trong hệ thống.');
            break;
          case 429:
            setMessage('Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.');
            break;
          default:
            setMessage(error.response.data.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
      } else if (error.request) {
        console.error('Không nhận được phản hồi:', error.request);
        setMessage('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        console.error('Lỗi:', error.message);
        setMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
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