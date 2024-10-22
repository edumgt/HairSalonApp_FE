import React, { useEffect, useState } from 'react';
import styles from './booking.module.css';
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import { getAll } from '../services/bookingService';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import HeaderButton from '../../../layouts/admin/components/table/buttonv2/headerButton';
import { Dropdown, Modal } from 'antd';
import EditButton from '../../../layouts/admin/components/table/buttonv2/editButton';

const HistoryBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRootPath = location.pathname === '/admin/historybooking';
  const [booking, setBooking] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const canManageBooking = userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'manager' || userRole === 'admin';

  const items = [
    { key: '1', label: 'RECEIVED' },
    { key: '2', label: 'COMPLETED' },
    { key: '3', label: 'CANCELLED' },
  ];

  const ListItem = ({ id, date, slot, period, account, stylistId, services, price, status }) => {
    const handleStatusChange = (key) => {
      // Implement status change logic here
      console.log(`Changing status of booking ${id} to ${items[parseInt(key) - 1].label}`);
    };

    return (
      <tr className={styles.row}>
        <td className={styles.info}>{id}</td>
        <td className={styles.info}>{date}</td>
        <td className={styles.info}>{slot.timeStart.slice(0, 5)}</td>
        <td className={styles.info}>{period}</td>
        <td className={styles.info}>{account.firstName} {account.lastName}</td>
        <td className={styles.info}>{account.id}</td>
        <td className={styles.info}>{stylistId.firstName} {stylistId.lastName}</td>
        <td className={styles.info}>{stylistId.id}</td>
        <td className={styles.info}>{services.map((service) => service.serviceName).join(', ')}</td>
        <td className={styles.info}>{price.toLocaleString()} VND</td>
        <td>
          <div className={styles.statusWrapper}>
            <div className={`${status === 'RECEIVED' ? styles.greenStatus : styles.redStatus}`}>{status}</div>
          </div>
        </td>
        {canManageBooking && (
          <td>
            <EditButton 
              id={id} 
              handleDelete={() => handleDelete(id)} 
              item={{ id, date, slotId: slot.id }} 
              forPage="updateBooking"
            />
          </td>
        )}
        <td>
          <Dropdown.Button
            menu={{
              items,
              onClick: ({ key }) => handleStatusChange(key),
            }}
          >
            Trạng thái
          </Dropdown.Button>
        </td>
      </tr>
    );
  };

  const loadBooking = async () => {
    try {
      const response = await getAll();
      setBooking(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (location.state?.shouldReload || location.state === null) {
      loadBooking();
    }
  }, [location.state]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredBookings = booking.filter((item) =>
    item.id.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa lịch đặt này?',
      onOk() {
        // Implement delete logic here
        console.log(`Deleting booking ${id}`);
      },
    });
  };

  const handleAddBooking = () => {
    navigate('/admin/historybooking/addBooking');
  };

  return (
    <div className={styles.main}>
      {isRootPath ? (
        <>
          <NavLink currentPage="Đặt lịch" />
          <div className={styles.tableGroup}>
            <HeaderButton 
              text="Thêm đặt lịch" 
              add={canManageBooking}
              onClick={canManageBooking ? handleAddBooking : undefined}
              handleSearch={handleSearch}
              searchTarget='ID'
            />
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.columnHeaderParent}>
                    <HeaderColumn title="ID đặt lịch" />
                    <HeaderColumn title="Ngày đặt lịch" />
                    <HeaderColumn title="Giờ đặt lịch" />
                    <HeaderColumn title="Định kỳ" />
                    <HeaderColumn title="Tên khách hàng" />
                    <HeaderColumn title="ID khách hàng" />
                    <HeaderColumn title="Tên stylist" />
                    <HeaderColumn title="ID stylist" />
                    <HeaderColumn title="Tên dịch vụ" />
                    <HeaderColumn title="Giá" />
                    <HeaderColumn title="Trạng thái đặt lịch" />
                    {canManageBooking && <HeaderColumn title="" />}
                    <HeaderColumn title="" />
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredBookings) ? (
                    filteredBookings.map((item, index) => (
                      <ListItem key={index} {...item} />
                    ))
                  ) : (
                    <ListItem key={filteredBookings.id} {...filteredBookings} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default HistoryBooking;
