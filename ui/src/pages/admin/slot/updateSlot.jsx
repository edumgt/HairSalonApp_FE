import React, { useEffect, useState } from 'react';
import CUForm from "../../../layouts/admin/components/formv2/form";
import NavLink from "../../../layouts/admin/components/link/navLink";
import { useLocation, useNavigate } from "react-router-dom";
import { getAll, update } from "../services/slotService";
import moment from "moment";
import { Modal, notification } from "antd";

function UpdateSlot() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const initialSlot = location.state?.item;
  const [selectedSlot, setSelectedSlot] = useState(initialSlot?.timeStart || null);

  useEffect(() => {
    const loadSlots = async () => {
      try {
        const response = await getAll();
        const slots = response.data.result.map(slot => ({
          value: moment(slot.timeStart, 'HH:mm:ss').format('HH:mm')
        }));
        setAvailableSlots(slots.filter(slot => slot.value !== initialSlot?.timeStart));
      } catch (error) {
        console.error("Error loading slots:", error);
      }
    };
    loadSlots();
  }, [initialSlot]);

  const onSelect = (time) => {
    if (time) {
      setSelectedSlot(time);
    } else {
      setSelectedSlot(null);
    }
  };

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
  ];

  const handleUpdate = async (values) => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có muốn cập nhật khung giờ này ?',
      onOk: async () => {
        try {
          const formattedValue = {
            id: initialSlot.id,
            timeStart: values.timeStart
          };
          
          const response = await update(formattedValue);
          notification.success({
            message: 'Thành công',
            description: 'Khung giờ đã được cập nhật!',
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
            description: 'Cập nhật khung giờ thất bại!',
            duration: 2
          });
        }
      },
    });
  };

  return (
    <>
      <NavLink currentPage='Cập nhật khung giờ' />
      <CUForm 
        inputs={inputs} 
        handleSave={handleUpdate} 
        initialValues={{ timeStart: moment(selectedSlot, 'HH:mm') }} 
      />
    </>
  );
}

export default UpdateSlot;
