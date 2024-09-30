import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const [profileName, setProfileName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+84');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [month, setMonth] = useState('');
  const [date, setDate] = useState('');
  const [year, setYear] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    console.log('Đăng ký với:', { profileName, phoneNumber, password, month, date, year, acceptTerms });
  };

  const handleFacebookSignUp = () => {
    console.log('Đăng ký bằng Facebook');
    // Thêm logic đăng ký Facebook ở đây
  };

  const handleGoogleSignUp = () => {
    console.log('Đăng ký bằng Google');
    // Thêm logic đăng ký Google ở đây
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Tạo các option cho tháng, ngày, năm
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="signup-container">
      <h2>Đăng ký miễn phí</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="profileName">Profile name</label>
          <input
            id="profileName"
            type="text"
            className="signup-input"
            placeholder="Enter your profile name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone number</label>
          <input
            id="phoneNumber"
            type="tel"
            className="signup-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <div className="password-input-container">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="signup-input"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={() => togglePasswordVisibility('password')}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <small>Sử dụng 8 ký tự trở lên kết hợp chữ cái, số và ký tự đặc biệt</small>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <div className="password-input-container">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="signup-input"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>What's your date of birth? (optional)</label>
          <div className="date-inputs">
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Month</option>
              {months.map((m, index) => (
                <option key={m} value={index + 1}>{m}</option>
              ))}
            </select>
            <select value={date} onChange={(e) => setDate(e.target.value)}>
              <option value="">Date</option>
              {days.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Year</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
          />
          <label htmlFor="terms">I accept the terms and privacy policy</label>
        </div>
        <button type="submit" className="signup-button">Sign up</button>
      </form>
      <div className="divider"></div>
      <p className="social-signup-text">Hoặc đăng ký bằng:</p>
      <div className="social-signup">
        <button onClick={handleFacebookSignUp} className="facebook-signup">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>
        <button onClick={handleGoogleSignUp} className="google-signup">
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
      <p className="login-link">Đã có tài khoản? <Link to="/">Đăng nhập</Link></p>
    </div>
  );
}

export default SignUp;
