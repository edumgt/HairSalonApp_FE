import React from 'react';
import { Button, Form, Input, Layout, Modal, Space, message } from 'antd';
import { Content } from "antd/es/layout/layout";
import styles from './changePassword.module.css';
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/profileService";
import NavLink from '../../../layouts/admin/components/link/navLink';

const ChangePassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values) => {
        Modal.confirm({
            title: 'Xác nhận thay đổi mật khẩu',
            content: 'Bạn có chắc chắn muốn thay đổi mật khẩu?',
            onOk: async () => {
                try {
                    const response = await changePassword({
                        oldPassword: values.oldPassword,
                        newPassword: values.newPassword
                    });
                    if (response.data && response.data.code === 201) {
                        message.success('Thay đổi mật khẩu thành công');
                        setTimeout(() => {
                            navigate('/admin/adminprofile', { state: { shouldReload: true } });
                        }, 1000);
                    } else {
                        throw new Error(response.data?.message || 'Thay đổi mật khẩu thất bại');
                    }
                } catch (error) {
                    console.error('Error changing password:', error);
                    message.error(error.message || 'Đã xảy ra lỗi khi thay đổi mật khẩu');
                }
            },
        });
    };

    const handleCancel = () => {
        navigate('/admin/adminprofile');
    };

    return (
        <>
        <NavLink currentPage='Đổi mật khẩu'/>
        <Layout className={styles.layout}>
            <Content className={styles.content}>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>Thay đổi mật khẩu</h2>
                    <Form
                        form={form}
                        name="changePassword"
                        onFinish={onFinish}
                        layout="vertical"
                        className={styles.form}
                    >
                        <Form.Item
                            name="oldPassword"
                            label="Mật khẩu hiện tại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Space size="middle">
                                <Button type="primary" htmlType="submit">
                                    Lưu
                                </Button>
                                <Button onClick={handleCancel}>
                                    Hủy
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
        </>
    );
};

export default ChangePassword;
