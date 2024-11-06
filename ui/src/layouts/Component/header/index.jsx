import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { Dropdown, Menu, Modal, message } from 'antd';
import { UserOutlined, LogoutOutlined, DownOutlined, KeyOutlined, StarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import "./index.scss";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [shinePoint, setShinePoint] = useState(0);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    setUserRole(storedUserRole || null);
  }, []);

  useEffect(() => {
    console.log('userRole changed:', userRole);
  }, [userRole]);

  console.log('Stored userRole:', userRole);

  useEffect(() => {
    const checkLoginStatus = () => {
      console.log('Checking login status in Header');
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('userName');
      const storedUsername = localStorage.getItem('username');
      const storedUserRole = localStorage.getItem('userRole');
      console.log('Stored userRole:', storedUserRole);
      console.log('Stored token:', token);
      console.log('Stored userName:', name);
      console.log('Stored username:', storedUsername);
      setIsLoggedIn(!!token);
      setUserName(name || '');
      setUsername(storedUsername || '');
      setUserRole(storedUserRole || null);
      if (token) {
        fetch('http://localhost:8080/api/v1/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.result) {
            setFirstName(data.result.firstName || '');
            setLastName(data.result.lastName || '');
            setShinePoint(data.result.shinePoint || 0);
            if (data.result.userRole) {
              setUserRole(data.result.userRole);
              localStorage.setItem('userRole', data.result.userRole);
            }
          }
        })
        .catch(error => console.error('Error fetching profile:', error));
      }
    };

    checkLoginStatus();

    const handleLoginEvent = (event) => {
      console.log('Login event received in Header', event.detail);
      setUserRole(event.detail.role);
      setFirstName(event.detail.firstName);
      setLastName(event.detail.lastName);
      checkLoginStatus();
    };
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('login', handleLoginEvent);
    window.addEventListener('logout', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('login', handleLoginEvent);
      window.removeEventListener('logout', checkLoginStatus);
    };

  }, []);

  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất?',
      onOk() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        setUserName('');
        setUsername('');
        setUserRole(null);

        window.dispatchEvent(new Event('logout'));
        navigate('/home');
        message.success('Đăng xuất thành công');
      },
      onCancel() {
        console.log('Hủy đăng xuất');
      },
    });
  };

  const menu =  useMemo(() => (
    <Menu>
      <Menu.Item key="1" icon={<StarOutlined className="shine-point-icon" />}>
      <span className="shine-point-item">
        Điểm tích lũy: <span className="shine-point-value">{shinePoint}</span>
      </span>
    </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>
        <Link to="/userprofile">Thông tin người dùng</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<KeyOutlined />}>
        <Link to="/change-password">Đổi mật khẩu</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<KeyOutlined />}>
      <Link to="/shine-history">Lịch sử tỏa sáng</Link>
      </Menu.Item>
      {(userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'STAFF' || userRole === 'STYLIST'
        || userRole === 'admin' || userRole === 'manager' || userRole === 'staff' || userRole === 'stylist'
      ) && (
        <Menu.Item key="5" icon={<UserOutlined />}>
          <Link to="/admin/adminprofile">Cổng Admin</Link>
        </Menu.Item>
      )}
      <Menu.Item key="6" onClick={handleLogout} icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  ), [shinePoint, userRole]);

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
         
        </ul>
      </div>
      <div className="header__right">
        {isLoggedIn ? (
          <Dropdown.Button 
            overlay={menu} 
            placement="bottomRight" 
            icon={<DownOutlined />}
          >
            <span style={{ fontWeight: 'bold', color: '#15397f' }}>Xin chào, {firstName} {lastName}</span>
            <UserOutlined style={{ fontSize: '20px', marginLeft: '8px' }} />
          </Dropdown.Button>
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