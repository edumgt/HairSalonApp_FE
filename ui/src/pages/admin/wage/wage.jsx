import styles from './wage.module.css';
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import HeaderButton from '../../../layouts/admin/components/table/button/headerButton';

  const ListItem = ({ no, name, role, month, kpi, bonus, total }) => {
    return (
      <tr className={styles.row}>
        <td className={styles.info}>{no}</td>
        <td className={styles.info}>{name}</td>
        <td className={styles.info}>{role}</td>
        <td className={styles.info}>{month}</td>
        <td className={styles.info}>{kpi}</td>
        <td className={styles.info}>{bonus}</td>
        <td className={styles.info}>{total}</td>
      </tr>
    );
  };

  const Wage = () => {
    const listItems = [
        {no: "1", name: "Erica Greenholt", role: "Manager", month: "2024-09",  kpi: "50", bonus: "2.000.000", total: "24.000.000"},
        {no: "2", name: "Everett Cassin", role: "Admin", month: "2024-10", kpi: "51", bonus: "1.000.000", total: "22.000.000"}
    ]

    return (
      <div className={styles.main}>
            <NavLink currentPage="Wage" />
            <div className={styles.tableGroup}>
                <HeaderButton text="Import wage" add={true}/>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                    <thead>
                        <tr className={styles.columnHeaderParent}>
                          <HeaderColumn title="No" sortable />
                          <HeaderColumn title="Name" sortable />
                          <HeaderColumn title="Role" sortable />
                          <HeaderColumn title="Month" sortable />
                          <HeaderColumn title="KPI" sortable />
                          <HeaderColumn title="Bonus" sortable />
                          <HeaderColumn title="Total" sortable />
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
  export default Wage;