import { Col, Row } from "antd";
import "./index.scss";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  const handleAboutClick = (e) => {
    if (location.pathname === "/about") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div className="footer-container">
      <Row className="footer-row">
        <Col
          xs={{ span: 5, offset: 1 }}
          lg={{ span: 6, offset: 2 }}
          className="footer-col"
        >
          <ul className="footer-list">
            <li>
              <Link
                to="/about"
                className="external-link"
                onClick={handleAboutClick}
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <a
                href="https://daynghe.30shine.com/"
                className="external-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Học cắt tóc{" "}
              </a>
            </li>
            <li>
              <a href="#" className={"external-link"}>
                30Shine shop
              </a>
            </li>
          </ul>
        </Col>
        <Col
          xs={{ span: 11, offset: 1 }}
          lg={{ span: 6, offset: 2 }}
          className="footer-col"
        >
          <ul className="footer-list">
            <li>
              <a href="#" className={"footer-link"}>
                {" "}
                Liên hệ học nghề tóc: 0967.86.3030
              </a>
            </li>
            <li>
              <a href="#" className={"footer-link"}>
                Liên hệ nhượng quyền
              </a>
            </li>
            <li>
              <a href="#" className={"footer-link"}>
                Liên hệ quảng cáo
              </a>
            </li>
          </ul>
        </Col>
        <Col
          xs={{ span: 5, offset: 1 }}
          lg={{ span: 6, offset: 2 }}
          className="footer-col"
        >
          <ul className="footer-list">
            <li>Giờ phục vụ: Thứ 2 đến Chủ Nhật, 8h30 - 20h30</li>
            <li>
              <a href="#" className={"footer-link"}>
                Chính sách bảo mật
              </a>
            </li>
            <li>Điều kiện giao dịch chung</li>
          </ul>
        </Col>
      </Row>
    </div>
  );
}

export default Footer;
