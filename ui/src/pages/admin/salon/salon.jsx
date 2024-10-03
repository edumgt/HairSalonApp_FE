import styles from './salon.module.css';
import editIcon from '../../../assets/admin/pencil-fiiled.svg'
import NavLink from '../../../layouts/admin/navLink'
import HeaderColumn from '../../../layouts/admin/headerColumn'
import HeaderButton from '../../../layouts/admin/headerButton';

const ListItem = ({ number, city, address, status, iconSrc }) => {
  return (
    <tr className={styles.row}>
      <td className={styles.number}>{number}</td>
      <td className={styles.city}>{city}</td>
      <td className={styles.address}>{address}</td>
      <td>
        <div className={styles.statusWrapper}>
          <div className={`${status === 'Open' ? styles.openStatus : styles.closeStatus}`}>{status}</div>
        </div>
      </td>
      <td>
        <img className={styles.salonImg} alt="" src={iconSrc} />
      </td>
      <td>
        <div className={styles.editGroup}>
          <div className={styles.edit}>Edit</div>
          <img className={styles.edit} src={editIcon} alt="" />
        </div>
      </td>
    </tr>
  );
};

const Salon = () => {
  const listItems = [
    { number: "1", city: "Milwaukee", address: "419 Kacey Valley, Hyattshire 88420-6093", status: "Open", iconSrc: "list.png" },
    { number: "2", city: "Milwaukee", address: "62870 Hettie Glens, Bradtkestead 37879", status: "Close", iconSrc: "list.png" },
    { number: "3", city: "Milwaukee", address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla...", status: "Open", iconSrc: "list.png" },
  ];

  return (
    <div className={styles.main}>

      <NavLink currentPage="Salon" />

    <div className={styles.tableGroup}>
          <HeaderButton text="Salon" />
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.columnHeaderParent}>
                  <HeaderColumn title="#" sortable />
                  <HeaderColumn title="District" sortable />
                  <HeaderColumn title="Street" />
                  <HeaderColumn title="Status" sortable />
                  <HeaderColumn title="Image" />
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
  );
};

export default Salon;
