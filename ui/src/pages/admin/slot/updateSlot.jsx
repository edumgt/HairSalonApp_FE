import React, { useEffect, useState } from 'react';
import { Modal, notification, Button, Form, TimePicker, Input } from "antd";
import { getAll, update } from "../services/slotService";
import styles from './updateSlot.module.css';
import moment from 'moment';

const UpdateSlotForm = ({ visible, onCancel, onSuccess, initialValues, onDelete }) => {
    const [form] = Form.useForm();
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        const loadSlots = async () => {
            try {
                const response = await getAll();
                const slots = response.data.result.map(slot => ({
                    value: moment(slot.timeStart, 'HH:mm:ss').format('HH:mm')
                }));
                setAvailableSlots(slots);
            } catch (error) {
                console.error("Error loading slots:", error);
            }
        };
        loadSlots();
    }, []);

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                id: initialValues.id,
                timeStart: moment(initialValues.timeStart, 'HH:mm')
            });
            setSelectedTime(moment(initialValues.timeStart, 'HH:mm'));
        }
    }, [visible, initialValues, form]);

    const handleUpdate = async (values) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có muốn cập nhật khung giờ này ?',
            onOk: async () => {
                try {
                    const formattedValue = {
                        id: initialValues.id,
                        timeStart: values.timeStart.format('HH:mm')
                    };
                    
                    const response = await update(formattedValue);
                    notification.success({
                        message: 'Thành công',
                        description: 'Khung giờ đã được cập nhật!',
                        duration: 2
                    });
                    onCancel();
                    onSuccess();
                    return response;
                } catch (error) {
                    console.error(error);
                    notification.error({
                        message: 'Thất bại',
                        description: error.response?.data?.message || 'Cập nhật khung giờ thất bại!',
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
            title="Cập Nhật Khung Giờ"
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
            bodyStyle={{ height: '400px' }}
            className={styles.updateSlotModal}
            destroyOnClose={true}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdate}
            >
                <Form.Item
                    name="id"
                    label="ID"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="timeStart"
                    label="Thời gian"
                    rules={[
                        { required: true, message: 'Vui lòng chọn thời gian!' },
                        {
                            validator: (_, value) => {
                                if (!value) {
                                    return Promise.reject('Thời gian không được bỏ trống');
                                }
                                const timeString = value.format('HH:mm');
                                if (availableSlots.some(slot => slot.value === timeString)) {
                                    return Promise.reject('Thời gian này đã tồn tại');
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <TimePicker format="HH:mm" />
                </Form.Item>

                <div className={styles.modalActions}>
                    <Button 
                        color="primary"
                        variant="outlined"
                        htmlType="submit"
                        className={styles.actionButton}
                    >
                        Cập nhật
                    </Button>

                    <Button 
                        color="danger"
                        variant="outlined"
                        onClick={() => {
                            onCancel();
                            onDelete(initialValues?.id);
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

export default UpdateSlotForm;
