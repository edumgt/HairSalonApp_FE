import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Rate, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import HairServices from "../../layouts/Component/hairservice";
import SpaServices from "../../layouts/Component/spaservice";
import BrandAmbassadors from "../../layouts/Component/saotoasang";
import TopStylists from "../../layouts/Component/topstylist";
import LatestNews from "../../layouts/Component/LatestNew";
import "./index.scss";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [form] = Form.useForm(); // tạo 1 ínstance cua form 
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => { // kiem tra trang thai dang nhap va so dien thoai 
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);

      const userPhone = localStorage.getItem('userPhone');
      if (userPhone) {
        setPhoneNumber(userPhone);
        form.setFieldsValue({ phone: userPhone });
      } else {
        setPhoneNumber('');
        form.setFieldsValue({ phone: '' });
      }
    };

    const handleLogout = () => {
      setPhoneNumber('');
      form.setFieldsValue({ phone: '' });
      setIsLoggedIn(false);
    };

    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('login', checkLoginStatus);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('login', checkLoginStatus);
      window.removeEventListener('logout', handleLogout);
    };
  }, [form]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleRadioClick = () => {
    setIsChecked(!isChecked);
  };

  const handleRateChange = (value) => {
    setRatingValue(value);
  };

  const handleSubmitRating = () => {
    if (!isLoggedIn) {
      message.warning("Bạn cần đăng nhập để thực hiện đánh giá.");
      navigate("/login");
    } else {
      if (ratingValue > 0) {
        navigate(`/danh-gia?rating=${ratingValue}`);
        message.success(`Cảm ơn bạn đã đánh giá ${ratingValue} sao!`);
      } else {
        message.error("Vui lòng chọn mức đánh giá trước khi gửi.");
      }
    }
  };

  const handleBooking = () => {
    if (isChecked) {
      navigate(`/booking`);
      setIsModalOpen(false);
    } else {
      message.warning("Bạn cần đồng ý với chính sách trước khi đặt lịch.");
    }
  };

  return (
    <div>
      <Row>
        <Col span={24}>
          <div className="home-container">
            <div className="banner-container">
              <img
                className="image-banner"
                alt="Banner description"
                src="https://storage.30shine.com/banner/2024/20240311_banner_dkp_w.jpeg"
              />
            </div>

            <div className="booking-feedback-container">
              <div className="feedback-section">
                <div className="feedback-content">
                  <p className="feedback-title">
                    MỜI BẠN ĐÁNH GIÁ CHẤT LƯỢNG PHỤC VỤ
                  </p>
                  <p className="feedback-description">{`Phản hồi của bạn sẽ giúp chúng tôi cải thiện chất lượng dịch vụ tốt hơn.`}</p>
                </div>

                <div className="rating-container">
                  <Form.Item name="rating" label="Đánh giá của bạn">
                    <Rate onChange={handleRateChange} />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={handleSubmitRating}
                    className="submit-rating-btn"
                  >
                    Gửi đánh giá
                  </Button>
                </div>
              </div>

              <div className="booking-section">
                <div className="booking-background" />
                <div className="booking-title">
                  <b>ĐẶT LỊCH GIỮ CHỖ CHỈ 30 GIÂY</b>
                </div>
                <br />
                <Form
                  form={form}
                  className="booking-form"
                  onFinish={showModal}
                  
                >
                  <Row gutter={16}>
                    <Col span={16}>
                      <Form.Item
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                          {
                            pattern: new RegExp(/^(\+84|0)(\d{9})$/),
                            message: "Vui lòng nhập số điện thoại hợp lệ",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập SĐT để đặt lịch"
                          className="booking-input"
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />  
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Button
                        type="primary"
                        className="booking-button"
                        block
                        htmlType="submit"
                      >
                        ĐẶT LỊCH NGAY
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <Modal
                  title="Thông báo cập nhật Chính sách bảo mật Công ty Cổ Phần Thương Mại Dịch vụ 30 Shine Việt Nam"
                  style={{ textAlign: "center", top: 20 }}
                  open={isModalOpen}
                  onOk={handleBooking}
                  onCancel={handleCancel}
                  width={700}
                  okText="Xác nhận"
                  cancelText="Đóng"
                >
                  <div className="scrollable-content">
                    <p>
                      Trong quá trình cung cấp dịch vụ, sản phẩm tới Quý
                      Khách hàng, 30 Shine cần xử lý dữ liệu cá nhân của
                      người dùng để có thể cung cấp dịch vụ một cách tốt.
                      30 Shine luôn tôn trọng quyền riêng tư và dữ liệu cá
                      nhân của tất cả người dùng theo quy định của pháp
                      luật Việt Nam.
                    </p>
                    <p>
                      30 Shine trân trọng thông báo chúng tôi đã cập nhật{" "}
                      <strong>
                        Chính sách xử lý dữ liệu cá nhân và bảo mật thông
                        tin người dùng
                      </strong>{" "}
                      theo các quy định mới nhất của Nghị định số
                      13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân.
                    </p>
                    {/* Nội dung chính sách */}
                  </div>
                  <div>
                    <form>
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleRadioClick}
                          />
                          Tôi đã đọc và đồng ý với{" "}
                          <a href="#" target="_blank">
                            Chính sách xử lý dữ liệu cá nhân và bảo mật
                            thông tin người dùng của 30Shine
                          </a>
                          .
                        </label>
                      </div>
                    </form>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <HairServices />
      <SpaServices />
      <BrandAmbassadors />
      <TopStylists />
      <LatestNews />
    </div>
  );
}

export default Home;
