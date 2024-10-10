import NavLink from '../../../layouts/admin/navLink'
import HeaderColumn from '../../../layouts/admin/headerColumn'
import HeaderButton from '../../../layouts/admin/headerButton'
import styles from './category.module.css'
import EditButton from '../../../layouts/admin/editButton'

const ListItem = ({categoryID, categoryName, categoryDes}) => {
    return(
        <tr className={styles.row}>
            <td className={styles.info}>{categoryID}</td>
            <td className={styles.info}>{categoryName}</td>
            <td className={styles.info}>{categoryDes}</td>
            <td>
                <EditButton/>
            </td>
        </tr>
    )
}
function Category() {
    const listItems = [
        { categoryID: "1", categoryName: "Milwaukee", categoryDes: "419 Kacey Valley, Hyattshire 88420-6093"},
        { categoryID: "2", categoryName: "Milwaukee", categoryDes: "62870 Hettie Glens, Bradtkestead 37879" },
        { categoryID: "3", categoryName: "Milwaukee", categoryDes: "Lorem ipsum dolor sit amet,"}
      ];
  return (
    <div className={styles.main}>

      <NavLink currentPage="Category" />

    <div className={styles.tableGroup}>
          <HeaderButton text="Add category" add="true"/>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.columnHeaderParent}>
                  <HeaderColumn title="Category ID" sortable />
                  <HeaderColumn title="Category Name" sortable />
                  <HeaderColumn title="Category Description" />
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
}

export default Category