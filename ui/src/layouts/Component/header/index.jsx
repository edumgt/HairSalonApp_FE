import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { Dropdown, Menu, Modal, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import "./index.scss";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('login', checkLoginStatus);
    window.addEventListener('logout', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('login', checkLoginStatus);
      window.removeEventListener('logout', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất?',
      onOk() {
        localStorage.removeItem('token');
        localStorage.removeItem('userPhone');
        window.dispatchEvent(new Event('logout'));
        navigate('/home');
        message.success('Đăng xuất thành công');
      },
      onCancel() {
        console.log('Hủy đăng xuất');
      },
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout} icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header">
      <div className="header__left">
        <img
          src="https://30shine.com/static/media/logo_30shine_new.7135aeb8.png"
          alt="logo"
          className="header__logo"
          width={100}
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        />

        <ul className="header__navigation">
          <li>
            <NavLink
              to="/home"
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
              })}
            >
              Trang chủ
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
              })}
            >
              Về 30Shine
            </NavLink>
          </li>
          <li>
            <NavLink
              to="https://daynghe.30shine.com/"
              style={({ isActive }) => ({
                textDecoration: isActive ? "underline" : "none",
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              Học cắt tóc
            </NavLink>
          </li>
          <li>Nhượng quyền</li>
          <li>Đối tác</li>
        </ul>
      </div>
      <div className="header__right">
        {isLoggedIn ? (
          <Dropdown overlay={menu} placement="bottomRight">
            <div className="header__right__user-icon">
              <UserOutlined style={{ fontSize: '20px' }} />
            </div>
          </Dropdown>
        ) : (
          <div
            className="header__right__login-button"
            onClick={() => navigate("/login")}
          >
            <span className="header__right__login-button__text">Đăng nhập</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
