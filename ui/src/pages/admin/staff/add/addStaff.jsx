import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, DatePicker, Button, message, InputNumber } from 'antd';
import NavLink from "../../../../layouts/admin/components/link/navLink"
import styles from './addStaff.module.css';

const { Option } = Select;

function AddStaff() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [salons, setSalons] = useState([]);

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
                message.error('Không thể lấy danh sách salon');
            }
        };

        fetchSalons();
    }, []);

    const handleSubmit = async (values) => {
        try {
            const formattedValues = {
                firstName: values.firstName,
                lastName: values.lastName,
                gender: values.gender,
                yob: values.yob,
                phone: values.phone,
                email: values.email,
                joinIn: values.joinIn.format('YYYY-MM-DD'),
                role: values.role,
                image: values.image,
                salonId: values.salonId
            };

            const response = await axios.post('http://localhost:8080/api/v1/staff', formattedValues, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data && response.data.code === 200) {
                message.success(response.data.message || 'Thêm nhân viên thành công');
                navigate('/admin/staff', { state: { refreshData: true } });
            } else {
                throw new Error(response.data.message || 'Thêm nhân viên thất bại');
            }
        } catch (error) {
            console.error('Lỗi thêm nhân viên:', error);
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm nhân viên');
        }
    };

    return (
        <div className={styles.addStaffContainer}>
            <NavLink currentPage='Thêm nhân viên' hasChild={true} nextPage='Add staff' />
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.form}
            >
                <Form.Item
                    name="salonId"
                    label="Chi nhánh"
                    rules={[{ required: true, message: 'Vui lòng chọn chi nhánh!' }]}
                >
                    <Select placeholder="Chọn chi nhánh">
                        {salons.map(salon => (
                            <Option key={salon.id} value={salon.id}>
                                {`${salon.address} (Quận ${salon.district})`}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="firstName"
                    label="Họ"
                    rules={[{ required: true, message: 'Vui lòng nhập Họ!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="lastName"
                    label="Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập Tên!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                >
                    <Select>
                        <Option value="male">Nam</Option>
                        <Option value="female">Nữ</Option>
                        <Option value="other">Khác</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="yob"
                    label="Năm sinh"
                    rules={[{ required: true, message: 'Vui lòng nhập năm sinh!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập Số điện thoại!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập Email!' },
                        { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="joinIn"
                    label="Ngày bắt đầu làm"
                    rules={[{ required: true, message: 'Vui lòng chọn Ngày bắt đầu làm!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Liên kết hình ảnh (URL)"
                    rules={[{ required: true, message: 'Vui lòng nhập URL!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Chức vụ"
                    rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
                >
                    <Select>
                        <Option value="STAFF">Nhân viên</Option>
                        <Option value="STYLIST">Thợ cắt tóc</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Thêm nhân viên
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddStaff;
