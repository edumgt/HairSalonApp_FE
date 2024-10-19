import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Rate, Modal, message } from 'antd';
import { useNavigate } from "react-router-dom";
import HairServices from "../../layouts/Component/services/hairservice";
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
  const [username, setUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isUnregisteredModalVisible, setIsUnregisteredModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {

// kiem tra trang thai dang nhap va so dien thoai 
    const checkLoginStatus = () => {
      console.log('Checking login status in Home');
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
      const storedFirstName = localStorage.getItem('firstName');
      const storedLastName = localStorage.getItem('lastName');
      const storedUserRole = localStorage.getItem('userRole');
      console.log('Stored data:', { token, storedUsername, storedFirstName, storedLastName, storedUserRole });
      setIsLoggedIn(!!token);
      setUsername(storedUsername || '');
      setFirstName(storedFirstName || '');
      setLastName(storedLastName || '');
      if (storedUsername) {
        form.setFieldsValue({ username: storedUsername });
      } else {
        form.setFieldsValue({ username: '' });
      }
    };

    checkLoginStatus();

    const handleLoginEvent = (event) => {
      console.log('Login event received in Home', event.detail);
      if (event.detail && typeof event.detail === 'object') {
        const { role, firstName, lastName } = event.detail;
        console.log('Received data:', { role, firstName, lastName });
        // Cập nhật state nếu cần
        // setUserRole(role || '');
        // setFirstName(firstName || '');
        // setLastName(lastName || '');
      } else {
        console.error('Invalid login event detail:', event.detail);
      }
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
  }, [form]);

  useEffect(() => {
    console.log('isModalOpen changed:', isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    console.log('isLoggedIn changed:', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    console.log('currentUsername changed:', currentUsername);
  }, [currentUsername]);


  const checkUsernameRegistration = async (username) => {
    try {
      console.log('Checking username registration for:', username);
      const response = await fetch(`http://localhost:8080/api/v1/auth/${username}`);
      console.log('API response status:', response.status);

      if (response.status === 400) {
        // Số điện thoại chưa đăng ký
        return false;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);

      // Kiểm tra cấu trúc dữ liệu trả về
      if (data.result && typeof data.result === 'object') {
        // Giả sử rằng nếu có dữ liệu trả về, số điện thoại đã đăng ký
        return true;
      } else {
        // Nếu không có dữ liệu trong result, số điện thoại chưa đăng ký
        return false;
      }
    } catch (error) {
      console.error('Error checking username registration:', error);
      if (error.message.includes('400')) {
        return false; // Số điện thoại chưa đăng ký
      }
      message.error('Không thể kiểm tra số điện thoại. Vui lòng thử lại sau.');
      return null;
    }
  };


  const showModal = () => {
    console.log('Showing modal');
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (isChecked) {
      setIsModalOpen(false);
      navigate('/booking');
    } else {
      message.error('Vui lòng đồng ý với chính sách trước khi tiếp tục.');
    }
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

  const handleBooking = async () => {
    console.log('handleBooking called');
    if (isLoggedIn) {
      console.log('User is logged in, showing modal');
      showModal();
      return;
    }
    const username = form.getFieldValue('username');
    if (!username) {
      message.error('Vui lòng nhập số điện thoại');
      return;
    }
    setCurrentUsername(username);
    console.log('Current username set to:', username);

    try {
      const isRegistered = await checkUsernameRegistration(username);
      console.log('Is username registered?', isRegistered);

      if (isRegistered === null) {
        // Xử lý lỗi đã được thực hiện trong hàm checkUsernameRegistration
        return;
      }

      if (isRegistered) {
        setIsPasswordModalVisible(true);
      } else {
        setIsUnregisteredModalVisible(true);
      }
    } catch (error) {
      console.error('Error in handleBooking:', error);
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUsername,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login response:', data);
        if (data.result && data.result.token) {
          localStorage.setItem('token', data.result.token);
          localStorage.setItem('username', currentUsername);
          
          // Gọi API profile để lấy thông tin chi tiết
          try {
            const profileResponse = await fetch('http://localhost:8080/api/v1/profile/', {
              headers: {
                'Authorization': `Bearer ${data.result.token}`
              }
            });
            const profileData = await profileResponse.json();
            console.log('Profile data:', profileData);
            
            if (profileResponse.ok && profileData.result) {
              const userRole = profileData.result.role || '';
              const firstName = profileData.result.firstName || '';
              const lastName = profileData.result.lastName || '';
              
              localStorage.setItem('firstName', firstName);
              localStorage.setItem('lastName', lastName);
              localStorage.setItem('userRole', userRole);
              
              setIsLoggedIn(true);
              setUsername(currentUsername);
              setFirstName(firstName);
              setLastName(lastName);
              
              // Dispatch event với role
              window.dispatchEvent(new CustomEvent('login', { 
                detail: { 
                  role: userRole,
                  firstName: firstName,
                  lastName: lastName
                } 
              }));
            } else {
              console.error('Failed to fetch profile data');
            }
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
          }
          
          setIsPasswordModalVisible(false);
          message.success('Đăng nhập thành công!');
          showModal();
        } else {
          message.error('Đăng nhập thất bại: Dữ liệu không hợp lệ từ server');
        }
      } else {
        message.error(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const handleRegisterNow = () => {
    setIsUnregisteredModalVisible(false);
    navigate('/register');
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
                  onFinish={handleBooking}

                >


                  <Row gutter={16}>
                    <Col span={16}>
                      <Form.Item
                        name="username"
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
                          onChange={(e) => {
                            setUsername(e.target.value);
                            form.setFieldsValue({ username: e.target.value });
                          }}
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
                  onOk={handleOk}
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
                <Modal
                  key={currentUsername}
                  title="Nhập mật khẩu"
                  open={isPasswordModalVisible}
                  onOk={handlePasswordSubmit}
                  onCancel={() => setIsPasswordModalVisible(false)}
                  okText="Đăng nhập"
                  cancelText="Hủy"
                >
                  <Form layout="vertical">
                    <Form.Item
                      label="Số điện thoại"
                    >
                      <Input  value={currentUsername} disabled />
                    </Form.Item>
                    <Form.Item
                      label="Mật khẩu"
                      name="password"
                      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                      <Input.Password
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Item>
                  </Form>
                </Modal>
                <Modal
                  title="Số điện thoại chưa đăng ký"
                  open={isUnregisteredModalVisible}
                  onOk={() => setIsUnregisteredModalVisible(false)}
                  onCancel={() => setIsUnregisteredModalVisible(false)}
                  footer={[
                    <Button key="back" onClick={() => setIsUnregisteredModalVisible(false)}>
                      Quay lại
                    </Button>,
                    <Button key="register" type="primary" onClick={handleRegisterNow}>
                      Đăng ký ngay
                    </Button>,
                  ]}
                >
                  <p>Số điện thoại này chưa được đăng ký. Bạn có muốn đăng ký ngay?</p>
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