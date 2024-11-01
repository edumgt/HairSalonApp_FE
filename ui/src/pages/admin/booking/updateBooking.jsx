import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, notification } from "antd";
import NavLink from "../../../layouts/admin/components/link/navLink";
import CUForm from "../../../layouts/admin/components/formv2/form";
import { update } from "../services/bookingService";
import { getAll as getAllSlots } from "../services/slotService";
import moment from 'moment';

function UpdateBooking() {
    const [slots, setSlots] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { id, date, slotId } = location.state?.item || {};

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const slotsResponse = await getAllSlots();
                setSlots(slotsResponse.data.result.map(slot => ({
                    label: moment(slot.timeStart, 'HH:mm').format('HH:mm'),
                    value: slot.id
                })));
            } catch (error) {
                console.error("Error fetching slots:", error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải danh sách khung giờ. Vui lòng thử lại sau.',
                });
            }
        };
        fetchSlots();
    }, []);

    const handleUpdate = async (values) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn cập nhật lịch đặt này?',
            onOk: async () => {
                try {
                    const response = await update({
                        bookingId: id,
                        slotId: values.slotId,
                        date: values.date.format('YYYY-MM-DD')
                    });
                    if (response.data && response.data.code === 0) {
                        notification.success({
                            message: 'Thành công',
                            description: 'Cập nhật lịch đặt thành công!',
                        });
                        navigate('/admin/historybooking', { state: { shouldReload: true } });
                    } else {
                        throw new Error(response.data?.message || 'Cập nhật thất bại');
                    }
                } catch (error) {
                    console.error('Error updating booking:', error);
                    notification.error({
                        message: 'Thất bại',
                        description: error.message || 'Đã xảy ra lỗi khi cập nhật lịch đặt',
                    });
                }
            },
        });
    };

    const inputs = [
        {
            label: 'Mã đặt lịch',
            name: 'id',
            isInput: true,
            isDisabled: true,
        },
        {
            label: 'Ngày đặt lịch',
            name: 'date',
            isDate: true,
            rules: [{ required: true, message: 'Vui lòng chọn ngày!' }]
        },
        {
            label: 'Khung giờ',
            name: 'slotId',
            isSelect: true,
            options: slots,
            rules: [{ required: true, message: 'Vui lòng chọn khung giờ!' }]
        }
    ];

    const initialValues = {
        id: id,
        date: moment(date),
        slotId: slotId
    };

    return (
        <>
            <NavLink currentPage='Cập nhật lịch đặt' />
            <CUForm
                inputs={inputs}
                handleSave={handleUpdate}
                initialValues={initialValues}
            />
        </>
    );
}

export default UpdateBooking;
