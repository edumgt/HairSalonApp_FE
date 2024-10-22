import styles from './booking.module.css';
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import HeaderButton from '../../../layouts/admin/components/table/button/headerButton';
import EditButton from '../../../layouts/admin/components/table/button/editButton';

  const ListItem = ({ id, name, cutomerID, serviceName, bookedDate, paymentStatus, bookingStatus }) => {
    return (
      <tr className={styles.row}>
        <td className={styles.info}>{id}</td>
        <td className={styles.info}>{name}</td>
        <td className={styles.info}>{cutomerID}</td>
        <td className={styles.info}>{serviceName}</td>
        <td className={styles.info}>{bookedDate}</td>
        <td>
            <div className={styles.statusWrapper}>
                <div className={`${paymentStatus === 'Paid' ? styles.greenStatus : styles.redStatus}`}>{paymentStatus}</div>
            </div>
        </td>
        <td className={styles.info}>
            <div className={styles.statusWrapper}>
                <div className={`${bookingStatus === 'Done' ? styles.greenStatus : styles.redStatus}`}>{bookingStatus}</div>
            </div></td>
        <td>
          <EditButton/>
        </td>
      </tr>
    );
  };

  const HistoryBooking = () => {
    const listItems = [
        {id: "1", name: "Erica Greenholt", cutomerID: "1", serviceName: "Cắt tóc nam", bookedDate: "2024-01-10", paymentStatus: "Paid", bookingStatus: "Done"},
        {id: "2", name: "Everett Cassin", cutomerID: "2", serviceName: "Uốn tóc", bookedDate: "2024-01-11", paymentStatus: "Not yet", bookingStatus: "In progress"}
    ]

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
                          <HeaderColumn title="ID khách hàng" />
                          <HeaderColumn title="Tên dịch vụ" sortable />
                          <HeaderColumn title="Ngày đặt lịch" sortable />
                          <HeaderColumn title="Trạng thái thanh toán" sortable />
                          <HeaderColumn title="Trạng thái đặt lịch" sortable />
                          <HeaderColumn title="" />
                        </tr>
                    </thead>
                    <tbody>
                        {listItems.map((item, index) => (
                        <ListItem key={index} {...item} />
                        ))}
                    </tbody>
                    </table>
                </div>  
            </div>
        </div>
    )
  };
  export default HistoryBooking;