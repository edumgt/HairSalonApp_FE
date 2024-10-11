import styles from './staff.module.css';
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import HeaderButton from '../../../layouts/admin/components/table/button/headerButton';
import EditButton from '../../../layouts/admin/components/table/button/editButton';
import { Outlet, useLocation } from 'react-router-dom';

  const ListItem = ({ id, name, dob, appliedDate, workPlace, role }) => {
    return (
      <tr className={styles.row}>
        <td className={styles.info}>{id}</td>
        <td className={styles.info}>{name}</td>
        <td className={styles.info}>{dob}</td>
        <td className={styles.info}>{appliedDate}</td>
        <td className={styles.info}>{workPlace}</td>
        <td className={styles.info}>{role}</td>
        <td>
          <EditButton/>
        </td>
      </tr>
    );
  };

  const Staff = () => {
    const listItems = [
        {id: "B01", name: "Erica Greenholt", dob: "2004-01-10", appliedDate: "2024-01-10", workPlace: "Fort Alisa", role: "Manager"},
        {id: "B02", name: "Everett Cassin", dob: "2006-01-11", appliedDate: "2024-01-11", workPlace: "Satterfieldville", role: "Admin"}
    ]
  
  const location = useLocation()
  const isRootPath = location.pathname === '/staff'

    return (
        <div className={styles.main}>
          {isRootPath 
            ? (
              <><NavLink currentPage="Staff" /><div className={styles.tableGroup}>
              <HeaderButton text="Add staff" add={true} linkToAdd='addStaff' />
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.columnHeaderParent}>
                      <HeaderColumn title="ID" sortable />
                      <HeaderColumn title="Name" sortable />
                      <HeaderColumn title="Date of Birth" sortable />
                      <HeaderColumn title="Applied date" sortable />
                      <HeaderColumn title="Workplace" sortable />
                      <HeaderColumn title="Role" sortable />
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
            </div></>
            ) : (
              <Outlet/>
            )
          }
        </div>
    )
  };
  export default Staff;