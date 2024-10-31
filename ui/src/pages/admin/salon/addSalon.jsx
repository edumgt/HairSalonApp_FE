import React from 'react'
import { Modal, notification, Form } from 'antd'
import CUForm from '../../../layouts/admin/components/formv2/form'
import { create } from '../services/salonService'
import styles from './addSalon.module.css'

const AddSalonForm = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();

    const inputs = [
        {
            label: 'Địa chỉ',
            name: 'address',
            isInput: true,
            rules: [{required: true, message: 'Vui lòng nhập địa chỉ!'}]
        },
        {
            label: 'Quận',
            name: 'district',
            isSelect: true,
            options: [
              {label: '1', value: '1'},
              {label: '3', value: '3'},
              {label: '4', value: '4'},
              {label: '5', value: '5'},
              {label: '6', value: '6'},
              {label: '7', value: '7'},
              {label: '8', value: '8'},
              {label: '10', value: '10'},
              {label: '11', value: '11'},
              {label: '12', value: '12'},
              {label: 'Tân Bình', value: 'Tân Bình'},
              {label: 'Tân Phú', value: 'Tân Phú'},
              {label: 'Bình Tân', value: 'Bình Tân'},
              {label: 'Gò Vấp', value: 'Gò Vấp'},
              {label: 'Phú Nhuận', value: 'Phú Nhuận'},
              {label: 'Bình Thạnh', value: 'Bình Thạnh'}
            ],
            rules: [{required: true, message: 'Vui lòng nhập quận!'}]
        }
    ]

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

    return (
        <Modal
            title="Thêm Chi Nhánh Mới"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            bodyStyle={{ height: '400px' }}
            className={styles.addSalonModal}
            destroyOnClose={true}
        >
            <CUForm 
                form={form}
                inputs={inputs}
                handleSave={handleCreate}
            />
        </Modal>
    )
}

export default AddSalonForm