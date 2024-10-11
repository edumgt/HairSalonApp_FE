import React from 'react'
import { useNavigate } from 'react-router-dom'
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import HeaderButton from '../../../layouts/admin/components/table/button/headerButton'
import styles from './service.module.css'
import EditButton from '../../../layouts/admin/components/table/button/editButton'

const ListItem = ({no, categoryID, serviceID, serviceName, serviceDes, duration, price, onEdit}) => {
    return(
    <tr className={styles.row}>
      <td className={styles.info}>{no}</td>
      <td className={styles.info}>{categoryID}</td>
      <td className={styles.info}>{serviceID}</td>
      <td className={styles.info}>{serviceName}</td>
      <td className={styles.info}>{serviceDes}</td>
      <td className={styles.info}>{duration}</td>
      <td className={styles.info}>{price}</td>
      <td>
        <EditButton onClick={() => onEdit({no, categoryID, serviceID, serviceName, serviceDes, duration, price})}/>
      </td>
    </tr>
    )
}

const Service = () => {
    const navigate = useNavigate()
    const listItems = [
        { no: "1", categoryID: "Milwaukee", serviceID: "419 Kacey Valley, Hyattshire 88420-6093", serviceName: "Open", serviceDes: "abc", duration: "list.png", price: "" },
        { no: "2", categoryID: "Milwaukee", serviceID: "62870 Hettie Glens, Bradtkestead 37879", serviceName: "Close", serviceDes: "abc", duration: "list.png", price: "" },
        { no: "3", categoryID: "Milwaukee", serviceID: "Lorem ipsum dolor sit amet,", serviceName: "Open", serviceDes: "abc", duration: "list.png", price: "" },
    ];

    const handleAddService = () => {
        navigate('addService')
    }

    const handleEditService = (serviceId) => {
        navigate(`/service/updateService/${serviceId}`)
    }

    return (
        <div className={styles.main}>
            <NavLink currentPage="Service" />
            <div className={styles.tableGroup}>
                <HeaderButton text="Add service" add={true} onClick={handleAddService} />
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.columnHeaderParent}>
                                <HeaderColumn title="No" sortable />
                                <HeaderColumn title="Category ID" sortable />
                                <HeaderColumn title="Service ID" />
                                <HeaderColumn title="Service Name" sortable />
                                <HeaderColumn title="Service Description" sortable />
                                <HeaderColumn title="Duration" />
                                <HeaderColumn title="Price" />
                                <HeaderColumn title="" />
                            </tr>
                        </thead>
                        <tbody>
                            {listItems.map((item, index) => (
                                <ListItem key={index} {...item} onEdit={handleEditService} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Service