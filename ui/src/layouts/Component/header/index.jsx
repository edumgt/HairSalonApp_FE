import { NavLink, useNavigate } from "react-router-dom";
import "./index.scss";

function Header() {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="header__left">
        <img
          src="https://30shine.com/static/media/logo_30shine_new.7135aeb8.png"
          alt="logo"
          className="header__logo"
          width={100}
          onClick={() => navigate("/home")} // Điều hướng về trang chủ
          style={{ cursor: "pointer" }} // Thêm con trỏ để chỉ ra logo có thể click
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
          <li>Học cắt tóc</li>
          <li>Nhượng quyền</li>
          <li>Đối tác</li>
        </ul>
      </div>
      <div className="header__right">
        <div
          className="header__right__login-button"
          onClick={() => navigate("/login")}
        >
          <span className="header__right__login-button__text">Đăng nhập</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
