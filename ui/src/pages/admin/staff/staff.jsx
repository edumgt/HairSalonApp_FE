import styles from './staff.module.css';
import NavLink from '../../../layouts/admin/navLink'
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
  const ListItem = ({ id, name, dob, appliedDate, workPlace, role }) => {
    return (
      <tr className={styles.row}>
        <td className={styles.number}>{id}</td>
        <td className={styles.city}>{name}</td>
        <td className={styles.address}>{dob}</td>
        <td className={styles.city}>{appliedDate}</td>
        <td className={styles.address}>{workPlace}</td>
        <td className={styles.address}>{role}</td>
        <td>
          <div className={styles.editGroup}>
            <div className={styles.edit}>Edit</div>
            <img className={styles.edit} src={editIcon} alt="" />
          </div>
        </td>
      </tr>
    );
  };

  const Staff = () => {
    const listItems = [
        {id: "B01", name: "Erica Greenholt", dob: "2004-01-10", appliedDate: "2024-01-10", workPlace: "Fort Alisa", role: "Manager"},
        {id: "B02", name: "Everett Cassin", dob: "2006-01-11", appliedDate: "2024-01-11", workPlace: "Satterfieldville", role: "Admin"}
    ]

    return (
        <div>
            <NavLink currentPage="Staff" />
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
                    <div className={styles.addButton}>
                    <img className={styles.arrowIcon} alt="" src={addIcon}  />
                    <div className={styles.add}>Add salon</div>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                    <thead>
                        <tr className={styles.columnHeaderParent}>
                        <HeaderColumn title="ID" sortable />
                        <HeaderColumn title="Name" sortable />
                        <HeaderColumn title="Date of Birth" />
                        <HeaderColumn title="Applied date" sortable />
                        <HeaderColumn title="Workplace" />
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
  export default Staff;