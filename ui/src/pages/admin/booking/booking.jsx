import React, { useEffect, useState } from 'react';
import styles from './booking.module.css';
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import { deleteById, getAll, updateStatus } from '../services/bookingService';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import HeaderButton from '../../../layouts/admin/components/table/buttonv2/headerButton';
import { Button, Dropdown, Modal, notification } from 'antd';
import EditButton from '../../../layouts/admin/components/table/buttonv2/editButton';
import { DownOutlined } from '@ant-design/icons';

const HistoryBooking = () => {
  const location = useLocation();
  const isRootPath = location.pathname === '/admin/historybooking';
  const [booking, setBooking] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const canManageBooking = userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'manager' || userRole === 'admin';
  const isAdmin = userRole === 'ADMIN' || userRole === 'admin';
  const isManager = userRole === 'MANAGER' || userRole === 'manager';
  const isStaff = userRole === 'STAFF' || userRole === 'staff';
  const isStylist = userRole === 'STYLIST' || userRole === 'stylist';

  const items = [
    { key: 'CHECKED_IN', label: 'Checkin', disabled: !isAdmin && !isManager && !isStaff },
    { key: 'SUCCESS', label: 'Hoàn thành', disabled: !isStylist },
    { key: 'COMPLETED', label: 'Xong', disabled: !isAdmin && !isManager && !isStaff },
    { key: 'CANCELED', label: 'Hủy', disabled: !isAdmin && !isManager && !isStaff },
  ];

  const ListItem = ({ id, date, slot, period, account, stylistId, services, price, status }) => {
    const handleStatusChange = async (key) => {
      Modal.confirm({
        title: 'Xác nhận',
        content: `Bạn có muốn cập nhật trạng thái đặt lịch này thành "${key}" ?`,
        onOk: async () => {
          try {
            const response = await updateStatus({ bookingId: id, status: key });
            if (response.data && response.data.code === 200) {
              notification.success({
                message: 'Thành công',
                description: 'Trạng thái đặt lịch đã được cập nhật!',
                duration: 2
              });
              loadBooking();
            } else {
              throw new Error(response.data?.message || 'Cập nhật trạng thái thất bại');
            }
          } catch (error) {
            console.error(error);
            notification.error({
              message: 'Thất bại',
              description: 'Cập nhật trạng thái đặt lịch thất bại!',
              duration: 2
            });
          }
        },
      });
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
            <div className={`${status === 'RECEIVED' || status === 'SUCCESS' ? styles.greenStatus
                              : status === 'CHECKED_IN' || status === 'COMPLETED' ? styles.blueStatus
                              : status === 'CANCELED' ? styles.redStatus : ''}`}>{status}</div>
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
          <Button color='danger' variant='outlined' size='small'>
            Hủy định kỳ
          </Button>
        </td>
        <td>
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => handleStatusChange(key),
            }}
            >
            <Button>
              Trạng thái <DownOutlined />
            </Button>
          </Dropdown>
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
      onOk: async () => {
        try {
          const response = await deleteById(id);
          notification.success({
            message: 'Thành công',
            description: 'Lịch đặt đã được xóa',
            duration: 2
          });
          loadBooking();
          return response
        } catch (error) {
          console.log(error);
          notification.error({
            message: 'Thất bại',
            description: 'Xóa lịch đặt thất bại',
            duration: 2
          });
        }
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };

  return (
    <div className={styles.main}>
      {isRootPath ? (
        <>
          <NavLink currentPage="Đặt lịch" />
          <div className={styles.tableGroup}>
            <HeaderButton 
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
