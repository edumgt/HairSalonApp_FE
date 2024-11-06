import React from 'react'
import { Modal, notification, Form, Input, Select, Button } from 'antd'
import { create, getAll } from '../services/salonService'
import styles from './addSalon.module.css'

const AddSalonForm = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    const handleCreate = async (values) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có muốn thêm mới chi nhánh này?',
            onOk: async () => {
                try {
                    const response = await create(values)
                    notification.success({
                        message: 'Thành công',
                        description: 'Chi nhánh đã được thêm mới!',
                        duration: 2
                    });
                    form.resetFields();
                    onCancel();
                    onSuccess();
                    return response
                } catch (error) {
                    console.log(error);
                    notification.error({
                        message: 'Thất bại',
                        description: error.response?.data?.message || 'Có lỗi xảy ra khi thêm chi nhánh',
                        duration: 2
                    });
                }
            },
            onCancel: () => {
                // Không làm gì khi người dùng hủy xác nhận
            },
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        });
    }

    const checkUniqueHotline = async (hotline) => {
        try {
            const response = await getAll();
            const salons = response.data.result;
    
            // Kiểm tra nếu hotline trùng với bất kỳ hotline nào đã tồn tại trong salon khác
            const isUnique = !salons.some(salon => salon.hotline === hotline);
    
            return isUnique;
        } catch (error) {
            console.error("Error checking unique hotline:", error);
            return false;
        }
    };

    return (
        <Modal
            title="Thêm Chi Nhánh Mới"
            open={visible}
            onCancel={handleCancel}
            footer={null}
            className={styles.addSalonModal}
            destroyOnClose={true}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleCreate}
            >

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Quận"
                    name="district"
                    rules={[{ required: true, message: 'Vui lòng chọn chi nhánh!' }]}
                >
                    <Select>
                        <Select.Option label="1" value="1">1</Select.Option>
                        <Select.Option label="3" value="3">3</Select.Option>
                        <Select.Option label="4" value="4">4</Select.Option>
                        <Select.Option label="5" value="5">5</Select.Option>
                        <Select.Option label="6" value="6">6</Select.Option>
                        <Select.Option label="7" value="7">7</Select.Option>
                        <Select.Option label="8" value="8">8</Select.Option>
                        <Select.Option label="10" value="10">10</Select.Option>
                        <Select.Option label="11" value="11">11</Select.Option>
                        <Select.Option label="12" value="12">12</Select.Option>
                        <Select.Option label="Tân Bình" value="Tân Bình">Tân Bình</Select.Option>
                        <Select.Option label="Tân Phú" value="Tân Phú">Tân Phú</Select.Option>
                        <Select.Option label="Bình Tân" value="Bình Tân">Bình Tân</Select.Option>
                        <Select.Option label="Gò Vấp" value="Gò Vấp">Gò Vấp</Select.Option>
                        <Select.Option label="Phú Nhuận" value="Phú Nhuận">Phú Nhuận</Select.Option>
                        <Select.Option label="Bình Thạnh" value="Bình Thạnh">Bình Thạnh</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Hotline"
                    name="hotline"
                    rules={[
                        { 
                            pattern: /^(84|0[3|5|7|8|9])+\d{8}\b/, 
                            message: 'Số điện thoại không hợp lệ!' 
                        },
                        { 
                            validator: async (_, hotline) => {
                                if (!hotline) {
                                    return Promise.reject(new Error('Vui lòng nhập số hotline!'));
                                }
                                const isUnique = await checkUniqueHotline(hotline); // Check uniqueness
                                if (!isUnique) {
                                    return Promise.reject(new Error('Số hotline đã tồn tại!'));
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Đường dẫn hình ảnh (URL)"
                    name="image"
                    rules={[{ required: true, message: 'Vui lòng nhập URL!' }]}
                >
                    <Input />
                </Form.Item>

                <div className={styles.modalActions}>
                    <Button 
                        color="primary"
                        variant='outlined'
                        htmlType="submit"
                        className={styles.actionButton}
                    >
                        Thêm
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default AddSalonForm