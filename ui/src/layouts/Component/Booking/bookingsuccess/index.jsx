import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

const BookingSuccess = () => {
  const [bookingInfo, setBookingInfo] = useState(null);

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem('bookingInfo'));
    setBookingInfo(info);
  }, []);

  if (!bookingInfo) return <div className="booking-success">Loading...</div>;

  return (
    <div className="booking-success">
      <h1>Đặt lịch thành công!</h1>
      <div className="booking-details">
        <p><strong>Salon:</strong> {bookingInfo.salon.address}</p>
        <p><strong>Dịch vụ:</strong> {bookingInfo.services.map(s => s.title).join(', ')}</p>
        <p><strong>Stylist:</strong> {bookingInfo.stylist.name}</p>
        <p><strong>Ngày:</strong> {bookingInfo.date.label}</p>
        <p><strong>Giờ:</strong> {bookingInfo.time}</p>
        <p><strong>Tổng giá:</strong> {bookingInfo.totalPrice.toLocaleString()} VND</p>
        <p><strong>Đặt lịch định kỳ:</strong> {bookingInfo.recurringBooking ? bookingInfo.recurringBooking : 'Không đặt lịch định kỳ'} Tuần </p>
      </div>
      <Link to="/" className="home-link">Quay về trang chủ</Link>
    </div>
  );
};

export default BookingSuccess;