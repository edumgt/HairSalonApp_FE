import styles from './salon.module.css';
import arrowIcon from '../../../assets/admin/arrow.svg'
import sortIcon from '../../../assets/admin/column-sorting.svg'
import addIcon from '../../../assets/admin/add.svg'
import filterIcon from '../../../assets/admin/filter.svg'
import editIcon from '../../../assets/admin/pencil-fiiled.svg'
import searchIcon from '../../../assets/admin/Search.svg'

const HeaderColumn = ({ title, sortable }) => {
  return (
    <th className={styles.columnHeader}>
      <div className={styles.headerName}>{title}</div>
      {sortable && <img className={styles.filterIcon} alt="" src={sortIcon} />}
    </th>
  );
};
const ListItem = ({ number, city, address, status, iconSrc }) => {
  return (
    <tr className={styles.row}>
      <td className={styles.number}>{number}</td>
      <td className={styles.city}>{city}</td>
      <td className={styles.address}>{address}</td>
      <td className={styles.statusWrapper}>
          <div className={styles.status}>{status}</div>
      </td>
      <td>
        <img className={styles.salonImg} alt="" src={iconSrc} />
      </td>
      <td>
        <div className={styles.editGroup}>
          <div>Edit</div>
          <img src={editIcon} alt="" />
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

      <div className={styles.adminPortalParent}>
        				<div className={styles.adminPortal}>Admin Portal</div>
        				<img className={styles.arrow} alt="" src={arrowIcon} />
        				<div className={styles.adminPortal}>Salon</div>
      </div>

    <div className={styles.tableGroup}>
          <div className={styles.headerButton}>
            <div className={styles.filter}>
              <img className={styles.filterIcon} alt="" src={filterIcon} />
            </div>
            <div className={styles.search}>
                <img className={styles.filterIcon} alt="" src={searchIcon} />
                <input 
                    className={styles.searchInput} 
                    type="text" 
                    placeholder="Search"
                />
            </div>
            <div className={styles.add}>
              <img className={styles.arrowIcon} alt="" src={addIcon}  />
              <div className={styles.addButton}>Add salon</div>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.columnHeaderParent}>
                  <HeaderColumn title="#" sortable />
                  <HeaderColumn title="District" sortable />
                  <HeaderColumn title="Street" />
                  <HeaderColumn title="Status" sortable />
                  <HeaderColumn title="Image" />
                  <HeaderColumn title="Actions" />
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
