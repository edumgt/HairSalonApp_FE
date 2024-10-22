import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, DatePicker, Button, message, InputNumber } from 'antd';
import NavLink from "../../../../layouts/admin/components/link/navLink"
import styles from './addStaff.module.css';


const { Option } = Select;

function AddStaff() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

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
                image: values.image
            };

            const response = await axios.post('http://localhost:8080/api/v1/staff', formattedValues);
            
            if (response.data && response.data.code === 200) {
                message.success('Thêm nhân viên thành công');
                navigate('/admin/staff', { state: { refreshData: true } });
            } else {
                throw new Error(response.data.message || 'Thêm nhân viên thất bại');
            }
        } catch (error) {
            console.error('Lỗi thêm nhân viên:', error);
            message.error(error.message || 'Có lỗi xảy ra khi thêm nhân viên');
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
