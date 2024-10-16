import styles from './combo.module.css';
import NavLink from '../../../layouts/admin/components/link/navLink';
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn';
import { Outlet, useLocation } from 'react-router-dom';
import { deleteById, getAll, searchById } from '../services/comboService';
import { useEffect, useState } from 'react';
import { Modal, notification } from 'antd';
import EditButton from '../../../layouts/admin/components/table/buttonv2/editButton';
import HeaderButton from '../../../layouts/admin/components/table/buttonv2/headerButton';

const Combo = () => {
    // const navigate = useNavigate()
  const location = useLocation();
  const isRootPath = location.pathname === '/combo';
  const [combo, setCombo] = useState([]);

  // Load data
  const loadData = async () => {
    try {
      const response = await getAll();
      setCombo(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  // Check state of page to reload
  useEffect(() => {
    if (location.state?.shouldReload || location.state === null) {
      loadData();
    }
  }, [location.state]);
//search
const handleSearch = async (id) => {
    try {
      const response = await searchById(id)
      setCombo(response.data.result)
    } catch (error) {
      console.log(error);
    }
}
  // Delete
  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Confirm delete',
      content: 'Are you sure you want to delete this combo?',
      onOk: async () => {
        try {
          const response = await deleteById(id);
          notification.success({
            message: 'Delete Successful',
            description: response.message,
            duration: 2
          });
          loadData();
        } catch (error) {
          console.log(error);
        }
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };

  

  const ListItem = ({ id, name, services, price, description }) => {
    return (
      <tr className={styles.row}>
        <td className={styles.info}>{id}</td>
        <td className={styles.info}>{name}</td>
        <td className={styles.info}>
          {services.map(service => (
            <div key={service.serviceId}>{service.serviceName}</div>
          ))}
        </td>
        <td className={styles.info}>{price}</td>
        <td className={styles.info}>{description}</td>
        <td>
          <EditButton id={id} forPage='updateCombo' handleDelete={handleDelete} item={{ id, name, services, price, description }} />
        </td>
      </tr>
    );
  };

  return (
    <div className={styles.main}>
      {isRootPath ? (
        <>
          <NavLink currentPage="Combo" />
          <div className={styles.tableGroup}>
            <HeaderButton 
              text="Add combo" 
              add={true} 
              linkToAdd='addCombo'
              handleSearch={handleSearch}
              loadData={loadData}
            />
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.columnHeaderParent}>
                    <HeaderColumn title="ID" />
                    <HeaderColumn title="Name" />
                    <HeaderColumn title="Services" />
                    <HeaderColumn title="Price" />
                    <HeaderColumn title="Description" />
                    <HeaderColumn title="" />
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(combo) ? (
                    combo.map((item, index) => (
                      <ListItem key={index} {...item} />
                    ))
                  ) : (
                    <ListItem key={combo.id} {...combo} />
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

export default Combo;
