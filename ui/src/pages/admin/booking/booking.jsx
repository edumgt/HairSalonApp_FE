import styles from './booking.module.css';
import NavLink from '../../../layouts/admin/components/link/navLink';
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn';
import HeaderButton from '../../../layouts/admin/components/table/button/headerButton';
import EditButton from '../../../layouts/admin/components/table/button/editButton';
import { useState, useEffect } from 'react';
import { Modal, message, Button, DatePicker, Select, Popconfirm } from 'antd';
import moment from 'moment';
import { CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import BASE_URL from "../../../api"
import { getAllByManager, getAllByStylist } from '../services/bookingService';

const { Option } = Select;

const ListItem = ({ booking, onClick, onRescheduleClick, onDeleteClick }) => {
  return (
    <tr className={styles.row}>
      <td className={styles.info} onClick={() => onClick(booking)}>{booking.id}</td>
      <td className={styles.info} onClick={() => onClick(booking)}>{`${booking.account.firstName} ${booking.account.lastName}`}</td>
      <td className={styles.info} onClick={() => onClick(booking)}>{`${booking.stylistId.firstName} ${booking.stylistId.lastName}`}</td>
      <td className={styles.info} onClick={() => onClick(booking)}>
        {booking.stylistId?.salons?.address ? 
          `${booking.stylistId.salons.address}${booking.stylistId.salons.district ? ` (Quận${booking.stylistId.salons.district})` : ''}`
          : 'Chưa có thông tin'
        }
      </td>
      <td className={styles.info} onClick={() => onClick(booking)}>
        <span className={styles.salonName}>
          {booking.stylistId?.salons?.name || 'Chưa có thông tin'}
        </span>
      </td>
      <td className={styles.info} onClick={() => onClick(booking)}>{booking.services.map(service => service.serviceName).join(', ')}</td>
      <td className={styles.info} onClick={() => onClick(booking)}>{booking.date}</td>
      <td className={styles.info} onClick={() => onClick(booking)}>{booking.slot.timeStart}</td>
      <td className={styles.info} onClick={() => onClick(booking)}>{booking.price}</td>
      <td className={styles.info} onClick={() => onClick(booking)}>
        <div className={styles.statusWrapper}>
          <div className={`
            ${booking.status === 'CANCELED' ? styles.redStatus : ''}
            ${['CHECKED_IN', 'SUCCESS', 'RECEIVED'].includes(booking.status) ? styles.greenStatus : ''}
          `}>
            {booking.status}
          </div>
        </div>
      </td>
      <td onClick={(e) => e.stopPropagation()}>
        <EditButton 
          onEdit={() => onRescheduleClick(booking)}
          onDelete={() => onDeleteClick(booking)}
        />
      </td>
    </tr>
  );
};

const BookingDetails = ({ booking, onClose, onStatusUpdate }) => {
    const [feedback, setFeedback] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [cancelReason, setCancelReason] = useState(null);
    const [localCancelReason, setLocalCancelReason] = useState(null);

    useEffect(() => {
        fetchFeedback();
        const role = localStorage.getItem('userRole');
        console.log('Current role from localStorage:', role);
        
        if (role) {
            setUserRole(role);
            console.log('Set user role:', role);
        } else {
            console.warn('No role found in localStorage');
        }
    }, []);

  // Debug permissions
  useEffect(() => {
    console.log('Debug permissions:', {
      userRole,
      bookingStatus: booking.status,
      canCheckIn: ['STAFF', 'MANAGER'].includes(userRole), // Sử dụng chữ hoa
      canSuccess: userRole === 'STYLIST',
      canCancel: userRole === 'STAFF'
    });
  }, [userRole, booking.status]);

    const fetchFeedback = async () => {
        try {
            const feedbackId = booking.id.replace('B', 'F');
            const response = await BASE_URL.get(`/feedback/${feedbackId}`);
            const data = response.data;
            
            if (data.code === 0) {
                setFeedback(data.result);
            } else {
                setFeedback(null);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setFeedback(null);
        }
    };

    const handleUpdateStatus = async (newStatus, reason = null) => {
        try {
            setIsUpdating(true);
            const requestBody = newStatus === 'CANCELED' ? { cancelReason: reason } : {};
            
            const response = await BASE_URL.put(`/booking/${booking.id}/${newStatus}`, requestBody);
            const data = response.data;
            
            if (data.code === 200) {
                message.success(`Cập nhật trạng thái thành ${newStatus} thành công`);
                if (typeof onStatusUpdate === 'function') {
                    await onStatusUpdate();
                }
                onClose();
                window.location.reload();
            } else {
                message.error(data.message || `Cập nhật trạng thái thành ${newStatus} thất bại`);
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            message.error('Đã xảy ra lỗi khi cập nhật trạng thái');
        } finally {
            setIsUpdating(false);
        }
    };

  // Sửa lại điều kiện kiểm tra quyền để match với format chữ hoa
  const canCheckIn = ['STAFF', 'MANAGER'].includes(userRole) && booking.status === 'RECEIVED';
  const canSuccess = userRole === 'STYLIST' && booking.status === 'CHECKED_IN';
  const canCancel = userRole === 'STAFF' && !['SUCCESS', 'CANCELED'].includes(booking.status);

    console.log('Debug permissions:', {
        userRole,
        bookingStatus: booking.status,
        canCheckIn,
        canSuccess,
        canCancel
    });

    const handleCancelBooking = () => {
        let selectedReason = null;

    Modal.confirm({
      title: 'Xác nhận hủy lịch',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn hủy lịch này?</p>
          <div className={styles.cancelDetails}>
            <p><strong>ID đặt lịch:</strong> {booking.id}</p>
            <p><strong>Khách hàng:</strong> {`${booking.account.firstName} ${booking.account.lastName}`}</p>
            <p><strong>Ngày:</strong> {booking.date}</p>
            <p><strong>Giờ:</strong> {booking.slot.timeStart}</p>
            <p><strong>Stylist:</strong> {`${booking.stylistId.firstName} ${booking.stylistId.lastName}`}</p>
            <p><strong>Dịch vụ:</strong> {booking.services.map(service => service.serviceName).join(', ')}</p>
          </div>
          <div className={styles.cancelReason}>
            <p><strong>Lý do hủy:</strong></p>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn lý do hủy lịch"
              onChange={(value) => {
                selectedReason = value; // Lưu giá trị được chọn vào biến local
                console.log('Selected reason:', value); // Debug log
              }}
            >
              <Option value="customer_request">Khách hàng yêu cầu hủy</Option>
              <Option value="stylist_unavailable">Stylist không kh dụng</Option>
              <Option value="salon_emergency">Salon có việc khẩn cấp</Option>
              <Option value="other">Lý do khác</Option>
            </Select>
          </div>
        </div>
      ),
      okText: 'Xác nhận hủy',
      okType: 'danger',
      cancelText: 'Đóng',
      onOk: () => {
        if (!selectedReason) {
          message.error('Vui lòng chọn lý do hủy lịch');
          return false;
        }

                setIsUpdating(true);
                handleUpdateStatus('CANCELED', selectedReason)
                    .then(() => {
                        onClose();
                        message.success({
                            content: 'Đã hủy lịch thành công',
                            duration: 3,
                        });
                        
                        setTimeout(() => {
                            Modal.info({
                                title: 'Các bước tiếp theo',
                                content: (
                                    <div>
                                        <p>Vui lòng thực hiện các bước sau:</p>
                                        <ol>
                                            <li>Liên hệ với khách hàng để thông báo về việc hủy lịch
                                                <ul>
                                                    <li>SĐT: {booking.account.username}</li>
                                                    <li>Tên: {`${booking.account.firstName} ${booking.account.lastName}`}</li>
                                                </ul>
                                            </li>
                                            {booking.paymentStatus === 'Paid' && (
                                                <li>Xử lý hoàn tiền cho khách hàng</li>
                                            )}
                                            <li>Thông báo cho stylist về lịch bị hủy</li>
                                            <li>Cập nhật sổ đặt lịch của salon</li>
                                        </ol>
                                    </div>
                                ),
                                okText: 'Đã hiểu',
                                onOk: () => {
                                    window.location.reload();
                                },
                                maskClosable: false,
                                keyboard: false,
                            });
                        }, 1000);
                    })
                    .catch((error) => {
                        console.error('Error canceling booking:', error);
                        message.error({
                            content: 'Có lỗi xảy ra khi hủy lịch',
                            duration: 3,
                        });
                    })
                    .finally(() => {
                        setIsUpdating(false);
                    });
            },
            maskClosable: false,
            keyboard: false,
        });
    };

    const handleCheckIn = async () => {
        Modal.confirm({
            title: 'Xác nhận check-in',
            content: (
                <div>
                    <p>Xác nhận check-in cho khách hàng:</p>
                    <p><strong>Khách hàng:</strong> {`${booking.account.firstName} ${booking.account.lastName}`}</p>
                    <p><strong>Dịch vụ:</strong> {booking.services.map(service => service.serviceName).join(', ')}</p>
                    <p><strong>Stylist:</strong> {`${booking.stylistId.firstName} ${booking.stylistId.lastName}`}</p>
                </div>
            ),
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await handleUpdateStatus('CHECKED_IN');
                    
                    onClose();
                    
                    message.success({
                        content: 'Check-in thành công!',
                        duration: 3,
                    });

                    setTimeout(() => {
                        Modal.success({
                            title: 'Các bước tiếp theo',
                            content: (
                                <div>
                                    <p>Thực hiện các bước sau khi khách hàng đã check in tại cửa hàng:</p>
                                    <ol>
                                        <li>Hướng dẫn khách hàng chờ đợi tại khu vực chờ</li>
                                        <li>Thông báo cho stylist {`${booking.stylistId.firstName} ${booking.stylistId.lastName}`} về khách đã check-in</li>
                                        <li>Chuẩn bị dụng cụ và khu vực làm việc</li>
                                        {booking.paymentStatus !== 'Paid' && (
                                            <li>Nhắc khách hàng về việc thanh toán sau khi hoàn thành dịch vụ</li>
                                        )}
                                    </ol>
                                </div>
                            ),
                            okText: 'Đã hiểu',
                            onOk: () => {
                                window.location.reload();
                            },
                            maskClosable: false,
                            keyboard: false,
                        });
                    }, 1000);
                } catch (error) {
                    message.error('Có lỗi xảy ra khi check-in');
                }
            },
        });
    };

  return (
    <div className={styles.bookingDetails}>
      <h2>Thông tin đặt lịch hiện tại</h2>
      <div className={styles.infoSection}>
        <p><span className={styles.label}>ID đặt lịch:</span> <span className={styles.value}>{booking.id}</span></p>
        <p><span className={styles.label}>Ngày đặt lịch:</span> <span className={styles.value}>{booking.date}</span></p>
        <p><span className={styles.label}>Giờ đặt lịch:</span> <span className={styles.value}>{booking.slot.timeStart}</span></p>
        <p>
          <span className={styles.label}> Tên Chi nhánh:</span> 
          <span className={styles.value}>
            {booking.stylistId?.salons?.name || 'Chưa có thông tin'}
          </span>
        </p>
        <p>
          <span className={styles.label}>Địa chỉ salon:</span> 
          <span className={styles.value}>
            {booking.stylistId?.salons ? 
              `${booking.stylistId.salons.address}${booking.stylistId.salons.district ? ` (Quận${booking.stylistId.salons.district})` : ''}`
              : 'Chưa có thông tin'
            }
          </span>
        </p>
        <p><span className={styles.label}>Stylist:</span> <span className={styles.value}>{`${booking.stylistId.firstName} ${booking.stylistId.lastName}`}</span></p>
        <p><span className={styles.label}>Khách hàng:</span> <span className={styles.value}>{`${booking.account.firstName} ${booking.account.lastName}`}</span></p>
        <p><span className={styles.label}>Dịch vụ:</span> <span className={styles.value}>{booking.services.map(service => service.serviceName).join(', ')}</span></p>
        <p><span className={styles.label}>Giá:</span> <span className={styles.value}>{booking.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
        <p><span className={styles.label}>Trạng thái:</span> <span className={styles.value}>{booking.status}</span></p>
      </div>

            <div className={styles.feedbackSection}>
                <h3>Đánh giá</h3>
                {feedback ? (
                    <>
                        <p><span className={styles.label}>Điểm đánh giá:</span> <span className={styles.value}>{feedback.rate || 'Chưa có đánh giá'}</span></p>
                        <p><span className={styles.label}>Nhận xét:</span> <span className={styles.value}>{feedback.feedback || 'Chưa có nhận xét'}</span></p>
                    </>
                ) : (
                    <p className={styles.noFeedback}>Chưa có đánh giá</p>
                )}
            </div>

            <div className={styles.statusSection}>
                <h3>Cập nhật trạng thái</h3>
                <div className={styles.statusButtons}>
                    <Button
                        type="primary"
                        onClick={handleCheckIn}
                        disabled={!canCheckIn || isUpdating}
                        loading={isUpdating}
                        icon={<UserOutlined />}
                    >
                        {isUpdating ? 'Đang xử lý...' : 'Check-in'}
                    </Button>

                    {booking.status === 'CHECKED_IN' && (
                        <Button
                            type="primary"
                            onClick={() => handleUpdateStatus('SUCCESS')}
                            disabled={!canSuccess || isUpdating}
                            loading={isUpdating}
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        >
                            Hoàn thành
                        </Button>
                    )}

                    <Button
                        danger
                        onClick={handleCancelBooking}
                        disabled={!canCancel || isUpdating}
                        loading={isUpdating}
                        icon={<CloseCircleOutlined />}
                    >
                        {isUpdating ? 'Đang hủy...' : 'Hủy lịch'}
                    </Button>
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <Button onClick={onClose} style={{ marginTop: 16 }}>Đóng</Button>
            </div>
        </div>
    );
};

const RescheduleModal = ({ booking, visible, onClose, onReschedule }) => {
    const [newDate, setNewDate] = useState(null);
    const [newSlotId, setNewSlotId] = useState(null);
    const [allSlots, setAllSlots] = useState([]);
    const [unavailableSlots, setUnavailableSlots] = useState([]);

    useEffect(() => {
        if (visible) {
            fetchAllSlots();
        }
    }, [visible]);

    const fetchAllSlots = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/v1/slot', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('All slots API response:', data);
            if (data.code === 200 && Array.isArray(data.result)) {
                setAllSlots(data.result);
            } else {
                console.error('API returned unexpected data:', data);
                message.error('Lỗi khi lấy thông tin slot');
            }
        } catch (error) {
            console.error('Error fetching all slots:', error);
            message.error('Không thể kết nối đến server');
        }
    };

    const fetchUnavailableSlots = async (date) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/v1/slot/${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Unavailable slots API response:', data);
            if (data.code === 200 && Array.isArray(data.result)) {
                setUnavailableSlots(data.result.map(slot => slot.id));
            } else {
                console.error('API returned unexpected data:', data);
                message.error('Lỗi khi lấy thông tin slot không khả dụng');
            }
        } catch (error) {
            console.error('Error fetching unavailable slots:', error);
            message.error('Không thể kt nối đến server');
        }
    };

    const handleDateChange = (date) => {
        setNewDate(date);
        setNewSlotId(null);
        if (date) {
            console.log('Fetching unavailable slots for date:', date.format('YYYY-MM-DD'));
            fetchUnavailableSlots(date.format('YYYY-MM-DD'));
        }
    };

    const resetForm = () => {
        setNewDate(null);
        setNewSlotId(null);
    };

    const handleReschedule = () => {
        if (newDate && newSlotId) {
            const rescheduleData = {
                bookingId: booking.id,
                slotId: newSlotId.toString(),
                date: newDate.format('YYYY-MM-DD')
            };
            onReschedule(rescheduleData, resetForm);
        } else {
            message.error('Vui lòng chọn ngày và giờ mới');
        }
    };

    return (
        <Modal
            title="Dời lịch đặt"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={500}
        >
            <div className={styles.rescheduleForm}>
                <div className={styles.currentBooking}>
                    <h3>Thông tin lịch hiện tại</h3>
                    <p>
                        <span>Khách hàng: </span>
                        {`${booking.account.firstName} ${booking.account.lastName}`}
                    </p>
                    <p>
                        <span>Ngày: </span>
                        {booking.date}
                    </p>
                    <p>
                        <span>Giờ: </span>
                        {booking.slot.timeStart}
                    </p>
                    <p>
                        <span>Stylist: </span>
                        {`${booking.stylistId.firstName} ${booking.stylistId.lastName}`}
                    </p>
                    <p>
                        <span>Dịch vụ: </span>
                        {booking.services.map(service => service.serviceName).join(', ')}
                    </p>
                </div>

                <div className={styles.newBookingSection}>
                    <h3>Chọn lịch mới</h3>
                    <div className={styles.dateTimeSelection}>
                        <DatePicker
                            value={newDate}
                            onChange={handleDateChange}
                            disabledDate={(current) => current && current < moment().endOf('day')}
                            placeholder="Chọn ngày"
                            style={{ flex: 1 }}
                        />
                        <Select
                            style={{ flex: 1 }}
                            placeholder="Chọn giờ"
                            onChange={(value) => setNewSlotId(value)}
                            value={newSlotId}
                            disabled={!newDate}
                        >
                            {allSlots.length > 0 ? (
                                allSlots
                                    .filter(slot => !unavailableSlots.includes(slot.id))
                                    .map(slot => (
                                        <Option key={slot.id} value={slot.id}>
                                            {slot.timeStart}
                                        </Option>
                                    ))
                            ) : (
                                <Option disabled>Không có slot kh dụng</Option>
                            )}
                        </Select>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <Button onClick={onClose}>
                        Hủy
                    </Button>
                    <Button 
                        type="primary" 
                        onClick={handleReschedule}
                        disabled={!newDate || !newSlotId}
                    >
                        Xác nhận dời lịch
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const HistoryBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRescheduleModalVisible, setIsRescheduleModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

  const fetchBookings = async () => {
    try {
      const userRole = localStorage.getItem('userRole');
      
      let data;
      
      // Sử dụng API manager cho các role MANAGER, STYLIST, STAFF
      if (['MANAGER', 'STAFF'].includes(userRole)) {
        const response = await getAllByManager();
        console.log('Manager API response:', response); // Debug log
        
        // Kiểm tra và đảm bảo data.result là một mảng
        if (response && response.result && Array.isArray(response.result)) {
          setBookings(response.result);
        } else {
          console.error('Invalid data format:', response);
          setBookings([]); // Set empty array if invalid data
        }
      } else if (userRole === 'STYLIST') {
        const response = await getAllByStylist();
        console.log('Stylist API response:', response.data); // Debug log
        
        if (response.data && response.data.result && Array.isArray(response.data.result)) {
          setBookings(response.data.result);
        } else {
          console.error('Invalid data format:', response.data);
          setBookings([]); // Set empty array if invalid data
        }
      }else {
        // API gốc cho ADMIN
        const response = await BASE_URL.get('/booking');
        console.log('Admin API response:', response.data); // Debug log
        
        if (response.data && response.data.result && Array.isArray(response.data.result)) {
          setBookings(response.data.result);
        } else {
          console.error('Invalid data format:', response.data);
          setBookings([]); // Set empty array if invalid data
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Không thể tải dữ liệu đặt lịch');
      setBookings([]); // Set empty array on error
    }
  };

    const handleBookingClick = (booking) => {
        setSelectedBooking(booking);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedBooking(null);
    };

    const handleRescheduleClick = (booking) => {
        console.log('Reschedule clicked for booking:', booking); 
        setSelectedBooking(booking);
        setIsRescheduleModalVisible(true);
    };

    const handleRescheduleModalClose = () => {
        setIsRescheduleModalVisible(false);
        setSelectedBooking(null);
    };

    const handleReschedule = async (rescheduleData, resetFormCallback) => {
        try {
            const response = await BASE_URL.put('/booking', rescheduleData);
            const data = response.data;
            
            if (data.code === 0) {
                message.success('Dời lịch thành công');
                await fetchBookings();
                const updatedBooking = bookings.find(b => b.id === rescheduleData.bookingId);
                if (updatedBooking) {
                    setSelectedBooking(updatedBooking);
                }
                if (resetFormCallback) {
                    resetFormCallback();
                }
                handleModalClose();
            } else {
                message.error(data.message || 'Dời lịch thất bại');
            }
        } catch (error) {
            console.error('Error rescheduling booking:', error);
            message.error('Đã xảy ra lỗi khi dời lịch');
        }
    };

    const handleDeleteBooking = async (booking) => {
        try {
            const response = await BASE_URL.delete(`/booking/${booking.id}`);
            const data = response.data;
            
            if (data.code === 0) {
                message.success('Xóa lịch đặt thành công');
                await fetchBookings();
            } else {
                message.error(data.message || 'Xóa lịch đặt thất bại');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            message.error('Đã xảy ra lỗi khi xóa lịch đặt');
        }
    };

    const handleDeleteClick = (booking) => {
        Modal.confirm({
            title: 'Xác nhận xóa lịch đặt',
            content: (
                <div>
                    <p>Bạn có chắc chắn muốn xóa lịch đặt này?</p>
                    <p><strong>ID đặt lịch:</strong> {booking.id}</p>
                    <p><strong>Khách hàng:</strong> {`${booking.account.firstName} ${booking.account.lastName}`}</p>
                    <p><strong>Ngày:</strong> {booking.date}</p>
                    <p><strong>Giờ:</strong> {booking.slot.timeStart}</p>
                </div>
            ),
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDeleteBooking(booking);
            },
        });
    };

    const handleStatusUpdate = async () => {
        try {
            await fetchBookings();
            if (selectedBooking) {
                const updatedBooking = bookings.find(b => b.id === selectedBooking.id);
                if (updatedBooking) {
                    setSelectedBooking(updatedBooking);
                }
            }
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error refreshing data:', error);
            message.error('Không thể cập nhật dữ liệu');
        }
    };

  return (
    <div className={styles.main}>
      <NavLink currentPage="Đặt lịch" />
      <div className={styles.tableGroup}>
        <HeaderButton add={false} />
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.columnHeaderParent}>
                <HeaderColumn title="ID đặt lịch" sortable />
                <HeaderColumn title="Tên khách hàng" sortable />
                <HeaderColumn title="Tên stylist" sortable />
                <HeaderColumn title="Địa chỉ salon" sortable />
                <HeaderColumn title="Tên chi nhánh" sortable />
                <HeaderColumn title="Tên dịch vụ" sortable />
                <HeaderColumn title="Ngày đặt lịch" sortable />
                <HeaderColumn title="Giờ đặt lịch" sortable />
                <HeaderColumn title="Giá" sortable />
                <HeaderColumn title="Trạng thái đặt lịch" sortable />
                <HeaderColumn title="" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <ListItem
                  key={index}
                  booking={booking}
                  onClick={handleBookingClick}
                  onRescheduleClick={handleRescheduleClick}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal hiển thị chi tiết */}
      <Modal
        title="Chi tiết đặt lịch"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={700}
      >
        {selectedBooking && (
          <BookingDetails
            booking={selectedBooking}
            onClose={handleModalClose}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </Modal>

            {selectedBooking && (
                <RescheduleModal
                    booking={selectedBooking}
                    visible={isRescheduleModalVisible}
                    onClose={handleRescheduleModalClose}
                    onReschedule={handleReschedule}
                />
            )}
        </div>
    );
};

export default HistoryBooking;