import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Modal, Form } from 'antd';
import styles from './manager.module.css';
import NavLink from '../../../layouts/admin/components/link/navLink';
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn';
import HeaderButton from '../../../layouts/admin/components/table/buttonv2/headerButton';
import EditButton from '../../../layouts/admin/components/table/buttonv2/editButton';
import { getAll } from '../services/managerService';

const ListItem = ({ id, staff, onEdit, onDelete, canManage }) => {
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

  const imageUrl = getImgurDirectUrl(staff?.image);

  return (
    <tr className={styles.row}>
      <td className={styles.info}>{id}</td>
      <td className={styles.info}>{`${staff?.firstName} ${staff?.lastName}`}</td>
      <td className={styles.info}>{staff?.gender}</td>
      <td className={styles.info}>{staff?.yob}</td>
      <td className={styles.info}>{staff?.phone}</td>
      <td className={styles.info}>{staff?.email}</td>
      <td className={styles.info}>{staff?.joinIn}</td>
      <td className={styles.info}>{staff?.salons?.id ? `${staff?.salons?.id} - ${staff?.salons?.address} (Quận ${staff?.salons?.district})` : 'Chưa phân công'}</td>
      <td className={styles.info}>{staff?.status ? 'Đang làm việc' : 'Đã nghỉ việc'}</td>
      <td className={`${styles.info} ${styles.imageCell}`}>
        {!imageError ? (
          <img 
            src={imageUrl} 
            alt={`${staff?.firstName} ${staff?.lastName}`} 
            className={styles.staffImage} 
            onError={handleImageError}
          />
        ) : (
          <div className={styles.imagePlaceholder}>No Image</div>
        )}
      </td>
      {canManage && (
        <td className={styles.actionCell}>
          <EditButton 
            onEdit={() => onEdit(staff?.code)} 
            onDelete={() => onDelete(staff?.code)}
          />
        </td>
      )}
    </tr>
  );
};

function Manager() {
  const [filteredManager, setFilteredManager] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const isRootPath = location.pathname === '/admin/manager';
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const canManage = userRole === 'ADMIN';

  const loadData = async () => {
    try {
      const response = await getAll();
      setFilteredManager(response.data.result);
    } catch (error) {
      console.log(error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải danh sách quản lý. Vui lòng thử lại sau.'
      });
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

  const handleEditManager = async (code) => {
    // Implement edit functionality if needed
    console.log('Edit manager:', code);
  };

  const handleDeleteManager = (code) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa quản lý này?',
      onOk: async () => {
        try {
          await deleteManager(code);
          Modal.success({
            content: 'Xóa quản lý thành công'
          });
          loadData();
        } catch (error) {
          Modal.error({
            title: 'Lỗi',
            content: 'Xóa quản lý thất bại. Vui lòng thử lại'
          });
        }
      }
    });
  };

  const filteredManagers = filteredManager.filter((item) =>
    item.staff && `${item.staff.firstName} ${item.staff.lastName}`.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={styles.main}>
      {isRootPath ? (
        <>
          <NavLink currentPage="Quản lý" />
          <div className={styles.tableGroup}>
            <HeaderButton 
              onSearch={handleSearch}
              searchTarget='tên'
            />
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.columnHeaderParent}>
                    <HeaderColumn title="Mã" />
                    <HeaderColumn title="Tên" />
                    <HeaderColumn title="Giới tính" />
                    <HeaderColumn title="Năm sinh" />
                    <HeaderColumn title="Số điện thoại" />
                    <HeaderColumn title="Email" />
                    <HeaderColumn title="Ngày bắt đầu làm" />
                    <HeaderColumn title="Chi nhánh" />
                    <HeaderColumn title="Trạng thái" />
                    <HeaderColumn title="Hình ảnh" />
                    {canManage && <HeaderColumn title="" />}
                  </tr>
                </thead>
                <tbody>
                  {filteredManagers.map((item) => (
                    <ListItem 
                      key={item.id} 
                      {...item} 
                      onEdit={canManage ? handleEditManager : undefined}
                      onDelete={canManage ? handleDeleteManager : undefined}
                      canManage={canManage}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <Outlet/>
      )}
    </div>
  );
}

export default Manager;