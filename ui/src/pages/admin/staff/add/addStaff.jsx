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
                message.success('Staff added successfully');
                navigate('/staff', { state: { refreshData: true } });
            } else {
                throw new Error(response.data.message || 'Failed to add staff');
            }
        } catch (error) {
            console.error('Error adding staff:', error);
            message.error(error.message || 'An error occurred while adding staff');
        }
    };

    return (
        <div className={styles.addStaffContainer}>
            <NavLink currentPage='Staff' hasChild={true} nextPage='Add staff' />
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.form}
            >
                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please input First Name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please input Last Name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{ required: true, message: 'Please select Gender!' }]}
                >
                    <Select>
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="yob"
                    label="Year of Birth"
                    rules={[{ required: true, message: 'Please input Year of Birth!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: true, message: 'Please input Phone number!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input Email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="joinIn"
                    label="Join Date"
                    rules={[{ required: true, message: 'Please select Join Date!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Image URL"
                    rules={[{ required: true, message: 'Please input Image URL!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Staff
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddStaff;
