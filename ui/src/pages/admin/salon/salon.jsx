import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styles from './salon.module.css'
import NavLink from "../../../layouts/admin/components/link/navLink";
import HeaderButton from "../../../layouts/admin/components/table/buttonv2/headerButton";
import HeaderColumn from "../../../layouts/admin/components/table/headerColumn";
import { Modal, notification, Space } from "antd";
import { getAll, switchStatus } from "../services/salonService";
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
    item.address.toString().includes(searchText)
  );

  const handleSwitchStatus = async (id) => {
      Modal.confirm({
        title: 'Xác nhận',
        content: `Bạn có muốn ${open ? 'mở cửa' : 'đóng cửa'} chi nhánh này ?`,
        onOk: async () => {
          try {
            const response = await switchStatus(id);
            notification.success({
              message: 'Thành công',
              description: 'Trạng thái chi nhánh đã được đổi',
              duration: 2
            });
            handleUpdateSuccess();
            return response
          } catch (error) {
            console.error(error);
            Modal.error({
              title: 'Thất bại',
              content: 'Đổi trạng thái chi nhánh thất bại. Vui lòng thử lại',
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
  const ListItem = ({ id, address, district, hotline, image, open }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    const getImgurDirectUrl = (url) => {
      if (!url) return '';
      const imgurRegex = /https?:\/\/(?:i\.)?imgur\.com\/(\w+)(?:\.\w+)?/;
      const match = url.match(imgurRegex);
      if (match && match[1]) {
        return `https://i.imgur.com/${match[1]}.jpg`;
      }
      return url;
    };

    const imageUrl = getImgurDirectUrl(image);
    return (
      <tr className={`${styles.row} ${styles.clickable}`}
          onClick={() => showUpdateModal({ open, id, address, district, hotline, image })}
      >
        <td className={styles.info}>{id}</td>
        <td className={styles.info}>{address}</td>
        <td className={styles.info}>{district}</td>
        <td className={styles.info}>{hotline}</td>
        <td className={`${styles.info} ${styles.imageCell}`}>
        {!imageError ? (
          <img 
            src={imageUrl} 
            // alt={{image}} 
            className={styles.salonImage} 
            onError={handleImageError}
          />
        ) : (
          <div className={styles.imagePlaceholder}>No Image</div>
        )}
      </td>
        <td className={`${open ? styles.greenStatus : styles.redStatus}`}>{open ? 'Đang hoạt động' : 'Đóng cửa'}</td>
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
                    <HeaderColumn title="Hotline" />
                    <HeaderColumn title="Hình ảnh" />
                    <HeaderColumn title="Trạng thái" />
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
            handleSwitchStatus={handleSwitchStatus}
          />
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default Salon
