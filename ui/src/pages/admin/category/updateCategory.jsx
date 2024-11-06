import React, { useEffect } from 'react';
import { Modal, notification, Button, Form, Input } from "antd";
import axios from 'axios';
import styles from './updateCategory.module.css';

const UpdateCategoryForm = ({ visible, onCancel, onSuccess, initialValues, onDelete }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                categoryId: initialValues.categoryId,
                categoryName: initialValues.categoryName,
                categoryDescription: initialValues.categoryDescription
            });
        }
    }, [visible, initialValues, form]);

    const handleUpdate = async (values) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có muốn cập nhật danh mục này ?',
            onOk: async () => {
                try {
                    const response = await axios.put('http://localhost:8080/api/v1/category',
                        values,
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );

                    if (response.data && response.data.code === 0) {
                        notification.success({
                            message: 'Thành công',
                            description: 'Danh mục đã được cập nhật!',
                            duration: 2
                        });
                        onCancel();
                        onSuccess();
                    } else {
                        throw new Error('Cập nhật danh mục thất bại');
                    }
                } catch (error) {
                    console.error(error);
                    notification.error({
                        message: 'Thất bại',
                        description: error.response?.data?.message || 'Cập nhật danh mục thất bại!',
                        duration: 2
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

    return (
        <Modal
            title="Cập Nhật Danh Mục"
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
            bodyStyle={{ height: '400px' }}
            className={styles.updateCategoryModal}
            destroyOnClose={true}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
            >
                <Form.Item
                    name="categoryId"
                    label="ID"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="categoryName"
                    label="Tên danh mục"
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="categoryDescription"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <div className={styles.modalActions}>
                    <Button 
                        color="primary"
                        variant='outlined'
                        htmlType="submit"
                        className={styles.actionButton}
                    >
                        Cập nhật
                    </Button>

                    <Button 
                        color="danger"
                        variant='outlined'
                        onClick={() => {
                            onCancel();
                            onDelete(initialValues?.categoryId);
                        }}
                        className={styles.actionButton}
                    >
                        Xóa
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default UpdateCategoryForm; 