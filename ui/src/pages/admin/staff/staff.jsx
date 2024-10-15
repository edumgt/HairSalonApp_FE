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

const ListItem = ({ id, code, firstName, lastName, gender, yob, phone, email, joinIn, role, image, onEdit, onDelete }) => {
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
      <td className={`${styles.info} ${styles.imageCell}`}>
        <img src={image} alt={`${firstName} ${lastName}`} className={styles.staffImage} />
      </td>
      <td className={styles.actionCell}>
        <EditButton onEdit={() => onEdit(code)} onDelete={() => onDelete(code)}/>
      </td>
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
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const isRootPath = location.pathname === '/staff';

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/staff');
      if (response.data && Array.isArray(response.data.result)) {
        setStaffList(response.data.result);
        setFilteredStaff(response.data.result);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to fetch staff data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

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
    navigate('/staff/addStaff');
  };

  const handleEditStaff = async (code) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/staff/${code}`);
      if (response.data && response.data.code === 200) {
        setEditingStaff(response.data.result);
        form.setFieldsValue({
          ...response.data.result,
          joinIn: response.data.result.joinIn ? dayjs(response.data.result.joinIn) : null
        });
        setIsEditModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching staff details:', error);
      Modal.error({
        content: 'Failed to fetch staff details',
      });
    }
  };

  const handleUpdateStaff = async (values) => {
    try {
      const updatedStaff = {
        ...values,
        yob: parseInt(values.yob),
        joinIn: values.joinIn.format('YYYY-MM-DD')
      };
      const response = await axios.put(`http://localhost:8080/api/v1/staff/${editingStaff.code}`, updatedStaff);
      if (response.data && response.data.code === 200) {
        Modal.success({
          content: 'Staff updated successfully',
        });
        setIsEditModalVisible(false);
        fetchStaff();
      } else {
        throw new Error('Failed to update staff');
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      Modal.error({
        content: 'Failed to update staff: ' + (error.response?.data?.message || error.message),
      });
    }
  };

  const handleDeleteStaff = (code) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this staff member?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8080/api/v1/staff/${code}`);
          Modal.success({
            content: 'Staff member deleted successfully',
          });
          fetchStaff(); // Refresh the staff list after deletion
        } catch (error) {
          console.error('Error deleting staff:', error);
          Modal.error({
            title: 'Error',
            content: 'Failed to delete staff member. Please try again.',
          });
        }
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.main}>
      {isRootPath ? (
        <>
          <NavLink currentPage="Staff" />
          <div className={styles.tableGroup}>
            <HeaderButton 
              text="Add staff" 
              add={true} 
              onClick={handleAddStaff}
              onSearch={handleSearch}
            />
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.columnHeaderParent}>
                    <HeaderColumn title="Code" sortable />
                    <HeaderColumn title="Name" sortable />
                    <HeaderColumn title="Gender" sortable />
                    <HeaderColumn title="Year of Birth" sortable />
                    <HeaderColumn title="Phone" sortable />
                    <HeaderColumn title="Email" sortable />
                    <HeaderColumn title="Join Date" sortable />
                    <HeaderColumn title="Role" sortable />
                    <HeaderColumn title="Image" />
                    <HeaderColumn title="" />
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((item) => (
                    <ListItem 
                      key={item.id} 
                      {...item} 
                      onEdit={handleEditStaff}
                      onDelete={handleDeleteStaff}
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
        title="Edit Staff"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={700} // Thu hẹp độ rộng của modal
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
              <Form.Item name="code" label="Code" rules={[{ required: true }]} className={styles.formItem}>
                <Input disabled />
              </Form.Item>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true }]} className={styles.formItem}>
                <Input />
              </Form.Item>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]} className={styles.formItem}>
                <Input />
              </Form.Item>
              <Form.Item name="gender" label="Gender" rules={[{ required: true }]} className={styles.formItem}>
                <Select>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
              <Form.Item name="yob" label="Year of Birth" rules={[{ required: true }]} className={styles.formItem}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]} className={styles.formItem}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]} className={styles.formItem}>
                <Input />
              </Form.Item>
              <Form.Item name="joinIn" label="Join Date" rules={[{ required: true }]} className={styles.formItem}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="image" label="Image URL" rules={[{ required: true }]} className={styles.formItem}>
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.submitButton}>
                  Update Staff
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
