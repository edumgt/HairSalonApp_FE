import React, { useState, useEffect } from 'react';
import { Table, Typography, Spin, message, Tag, Modal, Rate, Input, Button, Space, DatePicker, Select, ConfigProvider, Divider } from 'antd';
import { CalendarOutlined, ScissorOutlined, DollarOutlined, UserOutlined, ClockCircleOutlined, ExclamationCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import moment from 'moment';
import 'moment/locale/vi';
import vi_VN from 'antd/lib/locale/vi_VN';

// Đặt locale cho moment
moment.locale('vi');

const { Title } = Typography;
const { TextArea } = Input;

const { confirm } = Modal;

// Thêm hàm formatPrice sau các import và trước component
const formatPrice = (price) => {
  return price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });
};

// Giữ nguyên hàm getStatusColor
const getStatusColor = (status) => {
  switch (status) {
    case 'RECEIVED':
      return 'processing';
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    case 'SUCCESS':
      return 'warning';
    case 'PAID':
      return 'success';
    default:
      return 'default';
  }
};

function ShineHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isRescheduleModalVisible, setIsRescheduleModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newSlotId, setNewSlotId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [originalDate, setOriginalDate] = useState(null);
  const [originalSlotId, setOriginalSlotId] = useState(null);
  const [feedbackId, setFeedbackId] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingHistory();
    fetchSlots();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để xem lịch sử đặt lịch');
        setLoading(false);
        return;
      }

      const response = await axios.patch('http://localhost:8080/api/v1/booking', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.result) {
        setBookings(response.data.result);
      } else {
        throw new Error('Dữ liệu đặt lịch không tìm thấy');
      }
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử đặt lịch:', error);
      message.error('Không thể tải lịch sử đặt lịch. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const showModal = async (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để xem chi tiết');
        return;
      }

      // Lấy feedback ID từ booking
      const feedbackIdResponse = await axios.get(
        `http://localhost:8080/api/v1/booking/feedback/${booking.id}`, 
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (feedbackIdResponse.data.code === 0) {
        const feedbackId = feedbackIdResponse.data.result.id;
        
        // Lấy chi tiết feedback bằng feedback ID
        const feedbackDetailResponse = await axios.get(
          `http://localhost:8080/api/v1/feedback/${feedbackId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (feedbackDetailResponse.data.code === 0 && 
            feedbackDetailResponse.data.result) {
          const feedbackData = feedbackDetailResponse.data.result;
          setRating(parseInt(feedbackData.rate) || 0);
          setFeedback(feedbackData.feedback || '');
          setFeedbackStatus(feedbackData.status);
          setFeedbackSubmitted(feedbackData.status === 'CLOSE');
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin feedback:', error);
      setRating(0);
      setFeedback('');
      setFeedbackStatus(null);
      setFeedbackSubmitted(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const isBookingEditable = (status) => status === "RECEIVED";

  const handleDelete = () => {
    if (!isBookingEditable(selectedBooking.status)) {
      message.error('Không thể hủy lịch ở trạng thái hiện tại');
      return;
    }
    
    confirm({
      title: 'Xác nhận hủy lịch',
      content: 'Anh thật sự muốn hủy lịch à :<',
      okText: 'Đúng vậy',
      cancelText: 'Không, tôi đổi ý rồi',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            message.error('Vui lòng đăng nhập để hủy lịch');
            return;
          }

          const response = await axios.delete(`http://localhost:8080/api/v1/booking/${selectedBooking.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.status === 200 || response.status === 204) {
            message.success('Đã hủy lịch thành công. Hẹn gặp lại anh nhé! 😊');
            setIsModalVisible(false);
            fetchBookingHistory(); // Cập nhật lại danh sách đặt lịch
          } else {
            throw new Error(response.data?.message || 'Hủy lịch thất bại');
          }
        } catch (error) {
          console.error('Lỗi khi hủy lịch:', error);
          message.error(error.message || 'Không thể hủy lịch. Vui lòng thử lại sau.');
        }
      },
      onCancel() {
        console.log('Hủy bỏ việc xóa lịch');
      },
    });
  };

  const handleUpdate = () => {
    if (!isBookingEditable(selectedBooking.status)) {
      message.error('Không thể dời lịch ở trạng thái hiện tại');
      return;
    }
    
    if (selectedBooking) {
      setNewDate(selectedBooking.date);
      setNewSlotId(selectedBooking.slot.id);
      setIsRescheduleModalVisible(true);
    }
  };

  const handlePayment = () => {
    if (selectedBooking.status === "SUCCESS") {
      // Chuyển hướng đến trang thanh toán với thông tin booking
      navigate(`/payment/${selectedBooking.id}`, { 
        state: { 
          bookingInfo: selectedBooking
        } 
      });
      setIsModalVisible(false);
    } else {
      message.error('Chỉ có thể thanh toán cho các đặt lịch có trạng thái SUCCESS');
    }
  };

  const handleCancelPeriodic = () => {
    if (!isBookingEditable(selectedBooking.status)) {
      message.error('Không thể hủy định kỳ ở trạng thái hiện tại');
      return;
    }
    
    confirm({
      title: 'Xác nhận hủy đặt lịch định kỳ',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy đặt lịch định k này không?',
      okText: 'Đồng ý',
      cancelText: 'Hủy bỏ',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            message.error('Vui lòng đăng nhập để thực hiện thao tác ny');
            return;
          }

          const response = await axios.put(`http://localhost:8080/api/v1/booking/${selectedBooking.id}`, 
            { period: 0 },
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );

          if (response.status === 200) {
            message.success('Đã hủy đặt lịch định kỳ thành công');
            setIsModalVisible(false);
            fetchBookingHistory(); // Cập nhật lại danh sách đặt lịch
          } else {
            throw new Error(response.data?.message || 'Hủy đặt lịch định kỳ thất bại');
          }
        } catch (error) {
          console.error('Lỗi khi hủy đặt lịch định kỳ:', error);
          message.error(error.message || 'Không thể hủy đặt lịch định kỳ. Vui lng thử lại sau.');
        }
      },
    });
  };

  const handleSubmitFeedback = async () => {
    setSubmitAttempted(true);
    if (!rating) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            message.error('Vui lòng đăng nhập để gửi đánh giá');
            return;
        }

        // Lấy feedback ID từ API
        const feedbackIdResponse = await axios.get(
            `http://localhost:8080/api/v1/booking/feedback/${selectedBooking.id}`, 
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        if (feedbackIdResponse.data.code === 0) {
            // Gửi feedback với đúng format
            const feedbackData = {
                id: feedbackIdResponse.data.result.id,
                rate: rating.toString(),
                feedback: feedback || ''
            };

            const response = await axios.post(
                'http://localhost:8080/api/v1/feedback', 
                feedbackData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.code === 0) {
                message.success('Cảm ơn bạn đã gửi đánh giá!');
                setIsModalVisible(false);
                fetchBookingHistory();
            } else {
                throw new Error(response.data.message || 'Gửi đánh giá thất bại');
            }
        } else {
            throw new Error('Không thể lấy mã feedback');
        }
    } catch (error) {
        console.error('Lỗi khi gửi đánh giá:', error);
        message.error('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    }
  };

  const renderBookingDetails = () => {
    if (!selectedBooking) return null;

    const renderPeriodInfo = () => {
      if (selectedBooking.period > 0) {
        return `Có (${selectedBooking.period} tuần/lần)`;
      }
      return 'Không';
    };

    const isEditable = isBookingEditable(selectedBooking.status);

    // Tách và nhóm các dịch vụ theo loại (combo và dịch vụ lẻ)
    const groupedServices = selectedBooking.services.reduce((acc, service) => {
      if (service.isCombo) {
        acc.combos.push(service);
      } else {
        const existingService = acc.services.find(s => 
          (s.serviceId || s.id) === (service.serviceId || service.id)
        );
        if (existingService) {
          existingService.quantity = (existingService.quantity || 1) + 1;
        } else {
          acc.services.push({ ...service, quantity: 1 });
        }
      }
      return acc;
    }, { services: [], combos: [] });

    return (
      <div className="booking-details">
        <div className="booking-info-section">
          <h3>Thông tin đặt lịch</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Mã đặt lịch:</label>
              <span>{selectedBooking.id}</span>
            </div>
            <div className="info-item">
              <label>Chi nhánh:</label>
              <span>
                {`${selectedBooking.stylistId.salons.address} (Quận ${selectedBooking.stylistId.salons.district})`}
              </span>
            </div>
            <div className="info-item">
              <label>Ngày:</label>
              <span>{moment(selectedBooking.date).format('DD/MM/YYYY')}</span>
            </div>
            <div className="info-item">
              <label>Thời gian:</label>
              <span>{selectedBooking.slot.timeStart}</span>
            </div>
            <div className="info-item">
              <label>Stylist:</label>
              <span>{`${selectedBooking.stylistId.firstName} ${selectedBooking.stylistId.lastName}`}</span>
            </div>
            <div className="info-item">
              <label>Trạng thái:</label>
              <div className="status-tag">
                <Tag color={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status}
                </Tag>
              </div>
            </div>
            <div className="info-item">
              <label>Đặt lịch định kỳ:</label>
              <span>{renderPeriodInfo()}</span>
            </div>
          </div>
        </div>

        <div className="services-section">
          <h3>Chi tiết dịch vụ</h3>
          {groupedServices.services.length > 0 && (
            <div className="service-group">
              <h4>Dịch vụ đã chọn:</h4>
              {groupedServices.services.map((service, index) => (
                <div key={index} className="service-item">
                  <div className="service-info">
                    <span className="service-name">
                      {service.serviceName} {service.quantity > 1 ? `(x${service.quantity})` : ''}
                    </span>
                    <span className="service-description">{service.description}</span>
                  </div>
                  <div className="service-price">
                    <span>{formatPrice(service.price * service.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {groupedServices.combos.length > 0 && (
            <div className="combo-group">
              <h4>Combo đã chọn:</h4>
              {groupedServices.combos.map((combo, index) => (
                <div key={index} className="combo-item">
                  <div className="combo-header">
                    <span className="combo-name">
                      {combo.serviceName} {combo.quantity > 1 ? `(x${combo.quantity})` : ''}
                    </span>
                    <span className="combo-price">
                      {formatPrice(combo.price * (combo.quantity || 1))}
                    </span>
                  </div>
                  {combo.services && (
                    <div className="combo-services">
                      <p>Bao gồm:</p>
                      <ul>
                        {combo.services.map((service, idx) => (
                          <li key={idx}>
                            {service.serviceName} - {formatPrice(service.price)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="price-summary">
            <div className="total-services">
              <span>Tổng số dịch vụ lẻ: {groupedServices.services.length}</span>
              <span>Tổng số combo: {groupedServices.combos.length}</span>
            </div>
            <div className="total-price">
              <strong>Tổng thanh toán: {formatPrice(selectedBooking.price)}</strong>
            </div>
          </div>
        </div>

        <Divider />
        
        {selectedBooking.status === 'COMPLETED' && (
          <div className="rating-feedback">
            <h4>Đánh giá dịch vụ</h4>
            <div className="feedback-form">
              <div className="rating-section">
                {feedbackStatus === 'OPEN' ? (
                  // Form đánh giá khi status là OPEN
                  <>
                    <div className="rating-header">
                      <label>Đánh giá trải nghiệm của bạn</label>
                      <Rate 
                        value={rating} 
                        onChange={(value) => setRating(value)}
                      />
                    </div>
                    <TextArea
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Chia sẻ cảm nhận của bạn về dịch vụ..."
                      className="feedback-input"
                    />
                    {!rating && submitAttempted && (
                      <div className="rating-error">Vui lòng chọn số sao để đánh giá</div>
                    )}
                    <Button 
                      type="primary" 
                      onClick={handleSubmitFeedback}
                      className="submit-feedback-btn"
                    >
                      Gửi đánh giá
                    </Button>
                  </>
                ) : (
                  // Hiển thị kết quả đánh giá hoặc thông báo hết hạn
                  <div className="feedback-result">
                    <div className="feedback-content">
                      {rating || feedback ? (
                        // Có đánh giá
                        <>
                          <div className="rating-header">
                            <label>Đánh giá của bạn</label>
                            <Rate value={rating} disabled />
                          </div>
                          {feedback && (
                            <div className="feedback-text">
                              <p>{feedback}</p>
                            </div>
                          )}
                          <p className="feedback-status">Đã đánh giá!</p>
                        </>
                      ) : (
                        // Không có đánh giá và đã hết hạn
                        <div className="expired-feedback">
                          <ExclamationCircleOutlined className="expired-icon" />
                          <p>Anh đã hết thời gian đánh giá</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const columns = [
    {
      title: 'Mã đặt lịch',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Chi nhánh',
      dataIndex: ['stylistId', 'salons', 'address'],
      key: 'salon',
      render: (_, record) => (
        <span>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          {`${record.stylistId.salons.address} (Quận ${record.stylistId.salons.district})`}
        </span>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {moment(text).format('DD-MM-YYYY')}
        </span>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'services',
      key: 'services',
      render: (services) => (
        <>
          {services.map((service) => (
            <Tag key={service.serviceId} color="blue">
              <ScissorOutlined style={{ marginRight: 4 }} />
              {service.serviceName}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Tổng giá',
      dataIndex: 'price',
      key: 'price',
      render: (text) => (
        <span>
          <DollarOutlined style={{ marginRight: 8 }} />
          {text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </span>
      ),
    },
    {
      title: 'Stylist',
      dataIndex: ['stylistId', 'firstName'],
      key: 'stylist',
      render: (firstName, record) => (
        <span>
          <UserOutlined style={{ marginRight: 8 }} />
          {`${record.stylistId.firstName} ${record.stylistId.lastName}`}
        </span>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: ['slot', 'timeStart'],
      key: 'time',
      render: (timeStart) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          {timeStart}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        switch (status) {
          case 'RECEIVED':
            color = 'green';
            break;
          // Thêm các trường hợp khác nếu cần
        }
        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    }
  ];

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để xem khung giờ');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/v1/slot', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.code === 200 && Array.isArray(response.data.result)) {
        setSlots(response.data.result);
      } else {
        throw new Error('Dữ liệu khung giờ không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khung giờ:', error);
      message.error('Không thể tải danh sách khung giờ. Vui lòng thử lại sau.');
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newSlotId) {
      message.error('Vui lòng nhập ngày và chọn khung giờ mới');
      return;
    }

    // Kiểm tra định dạng ngày
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      message.error('Vui lòng nhập ngày theo định dạng YYYY-MM-DD');
      return;
    }

    // Kiểm tra nếu thời gian mới là trong quá khứ
    const now = moment();
    const newBookingTime = moment(`${newDate} ${slots.find(slot => slot.id === newSlotId)?.timeStart}`, 'YYYY-MM-DD HH:mm:ss');

    if (newBookingTime.isBefore(now)) {
      message.error('Không thể dời lịch về thời điểm trong quá khứ');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập để dời lịch');
        return;
      }

      const response = await axios.put('http://localhost:8080/api/v1/booking', {
        bookingId: selectedBooking.id,
        slotId: newSlotId,
        date: newDate
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.code === 0) {
        message.success(response.data.message);
        setIsRescheduleModalVisible(false);
        setIsModalVisible(false); // Đóng modal chi tiết đặt lịch
        fetchBookingHistory(); // Cập nhật lại danh sách đặt lịch
      } else {
        throw new Error(response.data.message || 'Dời lịch thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi dời lịch:', error);
      message.error(error.message || 'Không thể dời lịch. Vui lòng thử lại sau.');
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="shine-history-container">
      <Title level={2}>Lịch Sử Đặt Lịch</Title>
      <Table 
        dataSource={bookings} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => showModal(record),
        })}
      />
      <Modal
        title="Chi tiết đặt lịch"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button 
            key="delete" 
            onClick={handleDelete} 
            danger 
            disabled={!isBookingEditable(selectedBooking?.status)}
          >
            Hủy lịch
          </Button>,
          selectedBooking?.period > 0 && (
            <Button 
              key="cancelPeriodic"
              onClick={handleCancelPeriodic}
              danger
              disabled={!isBookingEditable(selectedBooking?.status)}
            >
              Hủy định kỳ
            </Button>
          ),
          <Button 
            key="update" 
            onClick={handleUpdate}
            disabled={!isBookingEditable(selectedBooking?.status)}
          >
            Dời lịch
          </Button>,
          <Button 
            key="payment" 
            type="primary" 
            onClick={handlePayment}
            disabled={selectedBooking?.status === "COMPLETED"}
          >
            {selectedBooking?.status === "COMPLETED" ? "Đã thanh toán" : "Thanh toán"}
          </Button>,
        ].filter(Boolean)}
        width={700}
        centered={true}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        {renderBookingDetails()}
      </Modal>
      <Modal
        title="Dời lịch"
        visible={isRescheduleModalVisible}
        onOk={handleReschedule}
        onCancel={() => setIsRescheduleModalVisible(false)}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            style={{ width: '100%' }}
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            placeholder="Nhập ngày mới (YYYY-MM-DD)"
          />
          <Select
            style={{ width: '100%' }}
            value={newSlotId}
            onChange={(value) => setNewSlotId(value)}
            placeholder="Chọn khung giờ mới"
          >
            {slots.map(slot => (
              <Select.Option key={slot.id} value={slot.id}>
                {slot.timeStart.slice(0, 5)}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </Modal>
    </div>
  );
}

export default ShineHistory;
