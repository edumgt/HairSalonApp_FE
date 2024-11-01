import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Form, Input, Select, DatePicker, Button, InputNumber } from 'antd';
import dayjs from 'dayjs';
import styles from './staff.module.css';
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import HeaderButton from '../../../layouts/admin/components/table/button/headerButton';
import EditButton from '../../../layouts/admin/components/table/button/editButton';
import { Outlet } from 'react-router-dom';

const { Option } = Select;

const ListItem = ({ code, firstName, lastName, gender, yob, phone, email, joinIn, role, image, salons, status, onEdit, onDelete, onPromote, canManageStaff }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Hàm để chuyển đổi URL imgur thành URL trực tiếp của hình ảnh
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
    <tr className={styles.row}>
      <td className={styles.info}>{code}</td>
      <td className={styles.info}>{`${firstName} ${lastName}`}</td>
      <td className={styles.info}>{gender}</td>
      <td className={styles.info}>{yob}</td>
      <td className={styles.info}>{phone}</td>
      <td className={styles.info}>{email}</td>
      <td className={styles.info}>{joinIn}</td>
      <td className={styles.info}>{role}</td>
      <td className={styles.info}>{salons?.id ? `${salons?.id} - ${salons?.address} (Quận ${salons?.district})` : 'Chưa phân công'}</td>
      <td className={styles.info}>{status ? 'Đang làm việc' : 'Đã nghỉ việc'}</td>
      <td className={`${styles.info} ${styles.imageCell}`}>
        {!imageError ? (
          <img 
            src={imageUrl} 
            alt={`${firstName} ${lastName}`} 
            className={styles.staffImage} 
            onError={handleImageError}
          />
        ) : (
          <div className={styles.imagePlaceholder}>No Image</div>
        )}
      </td>
      {canManageStaff && (
        <>
        <td className={styles.actionCell}>
          <EditButton onEdit={() => onEdit(code)} onDelete={() => onDelete(code)}/>
        </td>
        <td className={styles.actionCell}>
          {role !== 'MANAGER' && (
            <Button 
              type="primary"
              onClick={() => onPromote(code, salons.id)}
              disabled={role === 'MANAGER'}
            >
              Thăng chức
            </Button>
          )}
        </td>
        </>
      )}
    </tr>
  );
};

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const isRootPath = location.pathname === '/admin/staff';
  const [userRole, setUserRole] = useState('');
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const canManageStaff = userRole === 'ADMIN' || userRole === 'MANAGER';

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/staff', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && Array.isArray(response.data.result)) {
        setStaffList(response.data.result);
        setFilteredStaff(response.data.result);
      } else {
        throw new Error('Định dạng dữ liệu server nhận được không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi hiển thị:', error);
      setError('Lấy dữ liệu thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff, refreshData]);

  useEffect(() => {
    const filtered = staffList.filter(staff => 
      `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredStaff(filtered);
  }, [searchText, staffList]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleAddStaff = () => {
    navigate('/admin/staff/addStaff');
  };

  const handleEditStaff = async (code) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/staff/${code}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && response.data.code === 200) {
        const staffData = response.data.result;
        setEditingStaff(staffData);
        form.setFieldsValue({
          ...staffData,
          joinIn: staffData.joinIn ? dayjs(staffData.joinIn) : null,
          role: {
            value: staffData.role,
            disabled: staffData.role === 'MANAGER'
          }
        });
        setIsEditModalVisible(true);
      }
    } catch (error) {
      console.error('Lỗi hiển thị:', error);
      Modal.error({
        content: 'Lấy dữ liệu chi tiết nhân viên thất bại',
      });
    }
  };

  const handleUpdateStaff = async (values) => {
    try {
      const updatedStaff = {
        ...values,
        yob: parseInt(values.yob),
        joinIn: values.joinIn.format('YYYY-MM-DD'),
        salonId: values.salonId
      };
      console.log(updatedStaff)
      const response = await axios.put(`http://localhost:8080/api/v1/staff/${editingStaff.code}`, updatedStaff, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data && response.data.code === 200) {
        Modal.success({
          content: 'Cập nhật nhân viên thành công',
        });
        setIsEditModalVisible(false);
        fetchStaff();
      } else {
        throw new Error('Cập nhật nhân viên thất bại');
      }
    } catch (error) {
      console.error('Lỗi cập nhật nhân viên:', error);
      Modal.error({
        content: 'Cập nhật nhân viên thất bại: ' + (error.response?.data?.message || error.message),
      });
    }
  };

  const handleDeleteStaff = (code) => {
    Modal.confirm({
      title: 'Bạn có muốn xóa nhân  viên này ?',
      content: 'Bạn sẽ không thể khôi phục lại sau khi xóa.',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8080/api/v1/staff/${code}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          Modal.success({
            content: 'Xóa nhân viên thành công',
          });
          fetchStaff(); // Refresh the staff list after deletion
        } catch (error) {
          console.error('Lỗi xóa nhân viên:', error);
          Modal.error({
            title: 'Lỗi',
            content: 'Xóa nhân viên thất bại. Vui lòng thử lại',
          });
        }
      },
    });
  };

  const handlePromote = (code, salonId) => {
    Modal.confirm({
      title: 'Xác nhận thăng chức',
      content: 'Bạn có chắc chắn muốn thăng chức cho nhân viên này?',
      onOk: async () => {
        try {
          const response = await axios.put(`http://localhost:8080/api/v1/staff/promote/${code}`, {salonId: salonId}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.data && response.data.code === 200) {
            Modal.success({
              content: 'Thăng chức thành công',
            });
            fetchStaff(); // Refresh danh sách nhân viên
          } else {
            throw new Error('Thăng chức thất bại');
          }
        } catch (error) {
          console.error('Lỗi thăng chức:', error);
          Modal.error({
            title: 'Lỗi',
            content: error.response?.data?.message || 'Thăng chức thất bại. Vui lòng thử lại',
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

  useEffect(() => {
    if (location.state?.refreshData) {
      fetchStaff();
      // Xóa state sau khi đã sử dụng
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, fetchStaff, navigate]);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/salon', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data && response.data.code === 0) {
          setSalons(response.data.result);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách salon:', error);
        Modal.error({
          content: 'Không thể lấy danh sách salon'
        });
      }
    };

    fetchSalons();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.main}>
      {isRootPath ? (
        <>
          <NavLink currentPage="Nhân viên" />
          <div className={styles.tableGroup}>
            {canManageStaff && (
              <HeaderButton 
                text="Thêm nhân viên" 
                add={true} 
                onClick={handleAddStaff}
                onSearch={handleSearch}
                searchText='tên nhân viên'
              />
            )}
            {!canManageStaff && (
              <HeaderButton 
                onSearch={handleSearch}
                searchText='tên nhân viên'
              />
            )}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.columnHeaderParent}>
                    <HeaderColumn title="Mã"  />
                    <HeaderColumn title="Tên"  />
                    <HeaderColumn title="Giới tính"  />
                    <HeaderColumn title="Ngày sinh"  />
                    <HeaderColumn title="Số điện thoại"  />
                    <HeaderColumn title="Email"  />
                    <HeaderColumn title="Ngày bắt đầu làm"  />
                    <HeaderColumn title="Vai trò"  />
                    <HeaderColumn title="Chi nhánh" />
                    <HeaderColumn title="Trạng thái" />
                    <HeaderColumn title="Hình ảnh" />
                    {canManageStaff && <HeaderColumn title="" />}
                    {canManageStaff && <HeaderColumn title="" />}
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((item) => (
                    <ListItem 
                      key={item.id} 
                      {...item} 
                      onEdit={canManageStaff ? handleEditStaff : undefined}
                      onDelete={canManageStaff ? handleDeleteStaff : undefined}
                      onPromote={canManageStaff ? handlePromote : undefined}
                      canManageStaff={canManageStaff}
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
      {/* Modal for editing staff */}
      <Modal
        title="Cập nhật nhân viên"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={700}
        centered
        destroyOnClose={true}
      >
        <div className={styles.modalContent}>
          <Form
            form={form}
            onFinish={handleUpdateStaff}
            layout="vertical"
            initialValues={editingStaff}
          >
            <div className={styles.formGrid}>
              <Form.Item name="code" label="Mã nhân viên" rules={[{ required: true }]} className={styles.formItem}>
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="salonId"
                label="Chi nhánh"
                rules={[{ required: true, message: 'Vui lòng chọn chi nhánh!' }]}
                className={styles.formItem}
              >
                <Select placeholder="Chọn chi nhánh">
                  {salons.map(salon => (
                    <Option key={salon.id} value={salon.id}>
                      {`${salon.id} - ${salon.address} (Quận ${salon.district})`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="firstName" label="Họ" rules={[{ required: true }]} className={styles.formItem}>
                <Input />
              </Form.Item>
              <Form.Item name="lastName" label="Tên" rules={[{ required: true }]} className={styles.formItem}>
                <Input />
              </Form.Item>
              <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]} className={styles.formItem}>
                <Select>
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
              <Form.Item name="yob" label="Năm sinh" rules={[{ required: true }]} className={styles.formItem}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]} className={styles.formItem}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]} className={styles.formItem}>
                <Input />
              </Form.Item>
              <Form.Item name="joinIn" label="Ngày bắt đầu làm" rules={[{ required: true }]} className={styles.formItem}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="image" label="Liên kết hình ảnh (URL)" rules={[{ required: true }]} className={styles.formItem}>
                <Input />
              </Form.Item>
              <Form.Item 
                name="role" 
                label="Chức vụ" 
                rules={[{ required: true }]} 
                className={styles.formItem}
              >
                <Select
                  disabled={editingStaff?.role === 'MANAGER'}
                >
                  <Option value="STAFF">Nhân viên</Option>
                  <Option value="STYLIST">Thợ cắt tóc</Option>
                  {editingStaff?.role === 'MANAGER' && (
                    <Option value="MANAGER">Quản lý</Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.submitButton}>
                  Cập nhật nhân viên
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Staff;
