import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styles from './salon.module.css'
import NavLink from "../../../layouts/admin/components/link/navLink";
import HeaderButton from "../../../layouts/admin/components/table/buttonv2/headerButton";
import HeaderColumn from "../../../layouts/admin/components/table/headerColumn";
import EditButton from "../../../layouts/admin/components/table/buttonv2/editButton";
import { Modal, notification } from "antd";
import { deleteById, getAll } from "../services/salonService";
import AddSalonForm from './addSalon'
import UpdateSalonForm from './updateSalon';

function Salon() {
    const location = useLocation();
    const isRootPath = location.pathname === '/admin/salon';
    const [salon, setSalon] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedSalon, setSelectedSalon] = useState(null);

    // Load data
  const loadData = async () => {
    try {
      const response = await getAll();
      setSalon(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (location.state?.shouldReload || location.state === null) {
      loadData();
    }
  }, [location.state]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  const filteredSalon = salon.filter((item) =>
    item.id.toString().includes(searchText)
  );
// Delete
const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có muốn xóa chi nhánh này ?',
      onOk: async () => {
        try {
          const response = await deleteById(id);
          notification.success({
            message: 'Thành công',
            description: 'Chi nhánh đã được xóa',
            duration: 2
          });
          loadData();
          return response
        } catch (error) {
          console.error(error);
          Modal.error({
            title: 'Thất bại',
            content: 'Xóa chi nhánh thất bại. Vui lòng thử lại',
          });
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
  const ListItem = ({ id, address, district, open }) => {
    return (
      <tr className={styles.row}>
        <td className={styles.info}>{id}</td>
        <td className={styles.info}>{address}</td>
        <td className={styles.info}>{district}</td>
        <td className={`${open ? styles.greenStatus : styles.redStatus}`}>{open ? 'Đang hoạt động' : 'Đóng cửa'}</td>
        <td>
          <EditButton 
            id={id} 
            handleDelete={handleDelete}
            isModal={true}
            handleUpdate={() => showUpdateModal({ id, address, district, open })}
          />
        </td>
      </tr>
    );
  };

  const showAddModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddSuccess = () => {
    setIsModalVisible(false);
    loadData();
  };

  const showUpdateModal = (salon) => {
    setSelectedSalon(salon);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateModalCancel = () => {
    setIsUpdateModalVisible(false);
    setSelectedSalon(null);
  };

  const handleUpdateSuccess = () => {
    setIsUpdateModalVisible(false);
    setSelectedSalon(null);
    loadData();
  };

  return (
    <div className={styles.main}>
      {isRootPath ? (
        <>
          <NavLink currentPage="Chi nhánh" />
          <div className={styles.tableGroup}>
            <HeaderButton 
              text="Thêm chi nhánh" 
              add={true} 
              isModal={true}
              showAddModal={showAddModal}
              handleSearch={handleSearch}
              searchTarget='địa chỉ'
            />
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.columnHeaderParent}>
                    <HeaderColumn title="ID" />
                    <HeaderColumn title="Địa chỉ" />
                    <HeaderColumn title="Quận" />
                    <HeaderColumn title="Trạng thái" />
                    <HeaderColumn title="" />
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredSalon) ? (
                    filteredSalon.map((item, index) => (
                      <ListItem key={index} {...item} />
                    ))
                  ) : (
                    <ListItem key={filteredSalon.id} {...filteredSalon} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <AddSalonForm 
            visible={isModalVisible}
            onCancel={handleModalCancel}
            onSuccess={handleAddSuccess}
          />

          <UpdateSalonForm 
            visible={isUpdateModalVisible}
            onCancel={handleUpdateModalCancel}
            onSuccess={handleUpdateSuccess}
            initialValues={selectedSalon}
          />
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default Salon
