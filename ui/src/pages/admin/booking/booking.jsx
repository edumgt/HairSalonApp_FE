import styles from './booking.module.css';
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import { getAll } from '../services/bookingService';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeaderButton from '../../../layouts/admin/components/table/buttonv2/headerButton';
import { Dropdown } from 'antd';
import EditButton from '../../../layouts/admin/components/table/buttonv2/editButton';

  const HistoryBooking = () => {
    const items = [
      {
        key: '1',
        label: '1st item',
      },
      {
        key: '2',
        label: '2nd item',
      },
      {
        key: '3',
        label: '3rd item',
      },
    ];
    const location = useLocation();
    const isRootPath = location.pathname === '/admin/historybooking';
    const [booking, setBooking] = useState([]);
    const [searchText, setSearchText] = useState('');
    const ListItem = ({ id, date, slot, period, account, stylistId, services, price, status}) => {
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
          <td>
            <EditButton 
              id={id} 
              handleDelete={''} 
              item={{ id, date, slotId: slot.id }} 
              forPage="updateBooking"
            />
          </td>
          <td>
            <Dropdown.Button
              menu={{
                items,
                // onClick: ,
              }}
            >
              Trạng thái
            </Dropdown.Button>
          </td>
        </tr>
      );
    };
    // Load data
    const loadBooking = async () => {
      try {
        const response = await getAll();
        setBooking(response.data.result);
      } catch (error) {
        console.log(error);
      }
    };
    // Check state of page to reload
    useEffect(() => {
      if (location.state?.shouldReload || location.state === null) {
        loadBooking();
      }
    }, [location.state]);
    // Hàm xử lý tìm kiếm khi người dùng nhập
    const handleSearch = (e) => {
      setSearchText(e.target.value);
    };

    // Lọc kết quả tìm kiếm dựa trên searchText
    const filteredBookings = booking.filter((item) =>
      item.id.toLowerCase().includes(searchText.toLowerCase())
    );
  return (
    <div className={styles.main}>
      {isRootPath ? (
        <>
          <NavLink currentPage="Đặt lịch" />
          <div className={styles.tableGroup}>
            <HeaderButton 
              text="Thêm đặt lịch" 
              add={true} 
              linkToAdd='addBooking'
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
