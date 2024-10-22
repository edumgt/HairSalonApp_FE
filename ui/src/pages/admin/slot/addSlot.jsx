import React, { useEffect, useState } from 'react'
import NavLink from '../../../layouts/admin/components/link/navLink'
import { useNavigate } from 'react-router-dom'
import { Modal, notification } from 'antd'
import CUForm from '../../../layouts/admin/components/formv2/form'
import { create, getAll } from '../services/slotService'
import moment from 'moment'

function AddSlot() {
    const [availableSlots, setAvailableSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const loadSlots = async () => {
            try {
                const response = await getAll();
                const slots = response.data.result.map(slot => ({
                    value: moment(slot.timeStart, 'HH:mm:ss').format('HH:mm')
                }));
                setAvailableSlots(slots)
            } catch (error) {
                console.error("Error loading slots:", error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải danh sách khung giờ. Vui lòng thử lại sau.',
                    duration: 3
                });
            }
        };
        loadSlots();
    }, []);

    const onSelect = (time) => {
        if (time) {
            setSelectedSlot(time);
        } else {
            setSelectedSlot(null);
        }
    }

    const inputs = [
        {
            label: 'Thời gian',
            name: 'timeStart',
            isTime: true,
            rules: [{
                validator: (_, selectedSlot) => {
                    if (!selectedSlot) {
                        return Promise.reject('Thời gian không được bỏ trống');
                    }
                    if (availableSlots.some(slot => slot.value === selectedSlot.format('HH:mm'))) {
                        return Promise.reject('Thời gian này đã tồn tại');
                    }
                    return Promise.resolve();
                }
            }],
            onChange: onSelect
        }
    ]

    const handleCreate = async (value) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có muốn thêm mới khung giờ này ?',
            onOk: async () => {
                try {
                    const formattedValue = {
                        timeStart: value.timeStart
                    };
                    
                    const response = await create(formattedValue);
                    notification.success({
                        message: 'Thành công',
                        description: 'Khung giờ đã được thêm mới!',
                        duration: 2
                    });
                    setTimeout(() => {
                        navigate('/admin/slot', { state: { shouldReload: true } });
                    }, 1000);
                    return response;
                } catch (error) {
                    console.error(error);
                    notification.error({
                        message: 'Thất bại',
                        description: 'Thêm mới khung giờ thất bại!',
                        duration: 2
                    });
                }
            },
        });
    }

    return (
        <>
            <NavLink currentPage='Thêm khung giờ'/>
            <CUForm inputs={inputs} handleSave={handleCreate} />
        </>
    )
}

export default AddSlot
