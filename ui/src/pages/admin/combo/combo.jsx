import styles from './combo.module.css';
import NavLink from '../../../layouts/admin/components/link/navLink';
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn';
import { Outlet, useLocation } from 'react-router-dom';
import { deleteById, getAll } from '../services/comboService';
import { useEffect, useState } from 'react';
import { Modal, notification } from 'antd';
import EditButton from '../../../layouts/admin/components/table/buttonv2/editButton';
import HeaderButton from '../../../layouts/admin/components/table/buttonv2/headerButton';

const Combo = () => {
    // const navigate = useNavigate()
  const location = useLocation();
  const isRootPath = location.pathname === '/admin/combo';
  const [combo, setCombo] = useState([]);
  const [searchText, setSearchText] = useState('');

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
// Hàm xử lý tìm kiếm khi người dùng nhập
const handleSearch = (e) => {
  setSearchText(e.target.value);
};

// Lọc kết quả tìm kiếm dựa trên searchText
const filteredCombos = combo.filter((item) =>
  item.name.toLowerCase().includes(searchText.toLowerCase())
);

  // Delete
  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có muốn xóa combo này ?',
      onOk: async () => {
        try {
          const response = await deleteById(id);
          notification.success({
            message: 'Thành công',
            description: 'Combo đã được xóa',
            duration: 2
          });
          loadData();
          return response
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
            <div className={styles.serviceName} key={service.serviceId}>{service.serviceName}</div>
          ))}
        </td>
        <td className={styles.info}>{price.toLocaleString()} VND</td>
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
              text="Thêm combo" 
              add={true} 
              linkToAdd='addCombo'
              handleSearch={handleSearch}
              searchTarget='tên'
            />
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.columnHeaderParent}>
                    <HeaderColumn title="ID" />
                    <HeaderColumn title="Tên" />
                    <HeaderColumn title="Các dịch vụ" />
                    <HeaderColumn title="Giá" />
                    <HeaderColumn title="Mô tả" />
                    <HeaderColumn title="" />
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredCombos) ? (
                    filteredCombos.map((item, index) => (
                      <ListItem key={index} {...item} />
                    ))
                  ) : (
                    <ListItem key={filteredCombos.id} {...filteredCombos} />
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
