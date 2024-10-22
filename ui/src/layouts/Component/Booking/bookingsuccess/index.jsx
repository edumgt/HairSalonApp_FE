import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './index.scss';

const BookingSuccess = () => {
  const location = useLocation();
  const bookingInfo = location.state?.bookingInfo;
  const [stylistName, setStylistName] = useState('');

  useEffect(() => {
    const fetchStylistInfo = async () => {
      if (bookingInfo && bookingInfo.stylistId) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8080/api/v1/staff/${bookingInfo.stylistId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.data.code === 200) {
            const { firstName, lastName } = response.data.result;
            setStylistName(`${firstName} ${lastName}`);
          }
        } catch (error) {
          console.error('Error fetching stylist info:', error);
          setStylistName('Không thể tải thông tin stylist');
        }
      } else {
        setStylistName('Chưa chọn (Để hệ thống chọn giúp bạn)');
      }
    };

    fetchStylistInfo();
  }, [bookingInfo]);

  if (!bookingInfo) return <div className="booking-success">Không tìm thấy thông tin đặt lịch.</div>;

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
  };

  return (
    <div className="booking-success">
      <h1>Đặt lịch thành công!</h1>
      <div className="booking-details">
        <p><strong>Mã đặt lịch:</strong> {bookingInfo.id}</p>
        <p><strong>Ngày:</strong> {moment(bookingInfo.date).format('DD/MM/YYYY')}</p>
        <p><strong>Giờ:</strong> {bookingInfo.slot.timeStart}</p>
        <p><strong>Stylist:</strong> {stylistName || 'Đang tải...'}</p>
        <p><strong>Dịch vụ:</strong></p>
        <ul>
          {bookingInfo.services.map(service => (
            <li key={service.serviceId}>
              {service.serviceName} - {formatPrice(service.price)}
            </li>
          ))}
        </ul>
        <p><strong>Tổng giá:</strong> {formatPrice(bookingInfo.price)}</p>
        <p><strong>Trạng thái:</strong> {bookingInfo.status}</p>
        <p><strong>Đặt lịch định kỳ:</strong> {bookingInfo.period ? `Mỗi ${bookingInfo.period} tuần` : 'Không đặt lịch định kỳ'}</p>
      </div>
      <Link to="/" className="home-link">Quay về trang chủ</Link>
    </div>
  );
};

export default BookingSuccess;
