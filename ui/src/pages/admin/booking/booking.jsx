import styles from './booking.module.css';
import NavLink from '../../../layouts/admin/navLink'
import HeaderColumn from '../../../layouts/admin/headerColumn'
import HeaderButton from '../../../layouts/admin/headerButton';
import EditButton from '../../../layouts/admin/editButton';

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

  const Booking = () => {
    const listItems = [
        {id: "1", name: "Erica Greenholt", cutomerID: "1", serviceName: "Cắt tóc nam", bookedDate: "2024-01-10", paymentStatus: "Paid", bookingStatus: "Done"},
        {id: "2", name: "Everett Cassin", cutomerID: "2", serviceName: "Uốn tóc", bookedDate: "2024-01-11", paymentStatus: "Not yet", bookingStatus: "In progress"}
    ]

    return (
      <div className={styles.main}>
            <NavLink currentPage="Booking" />
            <div className={styles.tableGroup}>
                <HeaderButton add={false} />
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                    <thead>
                        <tr className={styles.columnHeaderParent}>
                          <HeaderColumn title="ID" sortable />
                          <HeaderColumn title="Customer name" sortable />
                          <HeaderColumn title="Customer ID" />
                          <HeaderColumn title="Service name" sortable />
                          <HeaderColumn title="Booked date" sortable />
                          <HeaderColumn title="Payment status" sortable />
                          <HeaderColumn title="Booking Status" sortable />
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
  export default Booking;