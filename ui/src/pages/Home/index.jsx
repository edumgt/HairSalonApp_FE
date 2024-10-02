import "./index.scss";
import { Button, Col, Form, Input, Row, Rate, Modal, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Nếu bạn sử dụng React Router
import HairServices from "../../layouts/Component/hairservice";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // State cho checkbox
  const [ratingValue, setRatingValue] = useState(0); // Lưu giá trị đánh giá
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Giả định là người dùng chưa đăng nhập

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

  const navigate = useNavigate(); // Hook để điều hướng

  // Cập nhật giá trị khi người dùng đánh giá
  const handleRateChange = (value) => {
    setRatingValue(value);
  };

  // Kiểm tra đăng nhập trước khi gửi đánh giá
  const handleSubmitRating = () => {
    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, điều hướng đến trang đăng nhập
      message.warning("Bạn cần đăng nhập để thực hiện đánh giá.");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
    } else {
      if (ratingValue > 0) {
        // Điều hướng sang trang đánh giá nếu người dùng đã đăng nhập
        navigate(`/danh-gia?rating=${ratingValue}`);
        message.success(`Cảm ơn bạn đã đánh giá ${ratingValue} sao!`);
      } else {
        message.error("Vui lòng chọn mức đánh giá trước khi gửi.");
      }
    }
  };

  const handleBooking = () => {
    if (isChecked) {
      navigate(`/datlich`);
      setIsModalOpen(false);
    } else {
      message.warning("Bạn cần đồng ý với chính sách trước khi đặt lịch.");
    }
  };

  return (
    <div>
      {" "}
      <Row>
        {" "}
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
                  {/* Nút để gửi đánh giá */}
                  <Button type="primary" onClick={handleSubmitRating} className="submit-rating-btn">
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
                {/* Form có validate */}
                <Form
                  className="booking-form"
                  onFinish={showModal} // Chỉ khi form hợp lệ thì show modal
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
                      <Modal
                        title="Thông báo cập nhật Chính sách bảo mật Công ty Cổ Phần Thương Mại Dịch vụ 30 Shine Việt Nam"
                        style={{ textAlign: "center", top: 20 }}
                        open={isModalOpen}
                        onOk={handleBooking}
                        onCancel={handleCancel}
                        width={700}
                        okText="Xác nhận" // Thay đổi chữ "OK" thành "Xác nhận"
                        cancelText="Đóng" // Thay đổi chữ "Cancel" thành "Đóng"
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
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <HairServices />
    </div>
  );
}

export default Home;
