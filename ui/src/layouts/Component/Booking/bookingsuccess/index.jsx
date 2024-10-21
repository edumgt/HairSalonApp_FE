import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

const BookingSuccess = () => {
  const [bookingInfo, setBookingInfo] = useState(null);

  const timeSlotMapping = {
    1: '8h00', 2: '8h40', 3: '9h00', 4: '9h40', 5: '10h00',
    6: '10h40', 7: '11h00', 8: '11h40', 9: '12h00', 10: '12h40',
    11: '13h00', 12: '13h40', 13: '14h00', 14: '14h40', 15: '15h00',
    16: '15h40', 17: '16h00', 18: '16h40', 19: '17h00', 20: '17h40',
    21: '18h00', 22: '18h40', 23: '19h00', 24: '19h40', 25: '20h00',
  };

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('bookingInfo'));
    setBookingInfo(info);
  }, []);

  if (!bookingInfo) return <div className="booking-success">Đang tải...</div>;

  return (
    <div className="booking-success">
      <h1>Đặt lịch thành công!</h1>
      <div className="booking-details">
        <p><strong>Salon:</strong> {bookingInfo.salon.address}</p>
        <p><strong>Dịch vụ:</strong> {bookingInfo.services.map(s => s.serviceName || s.name).join(', ')}</p>
        <p><strong>Stylist:</strong> {bookingInfo.stylist.name}</p>
        <p><strong>Ngày:</strong> {bookingInfo.date.label}</p>
        <p><strong>Giờ:</strong> {timeSlotMapping[bookingInfo.time]}</p>
        <p><strong>Tổng giá:</strong> {bookingInfo.totalPrice.toLocaleString()} VND</p>
        <p><strong>Đặt lịch định kỳ:</strong> {bookingInfo.recurringBooking ? `${bookingInfo.recurringBooking} Tuần` : 'Không đặt lịch định kỳ'}</p>
      </div>
      <Link to="/" className="home-link">Quay về trang chủ</Link>
    </div>
  );
};

export default BookingSuccess;
