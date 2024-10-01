import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import SignUp from './pages/signUp/SignUp';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Chuyển hướng từ trang chủ đến trang đăng nhập */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Chuyển hướng các đường dẫn không hợp lệ đến trang đăng nhập */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;