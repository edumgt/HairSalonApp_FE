import CUForm from "../../../layouts/admin/components/formv2/form";
import NavLink from "../../../layouts/admin/components/link/navLink";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAll, update } from "../services/slotService";
import moment from "moment";
import { Modal, notification } from "antd";

function UpdateSlot() {
      const [availableSlot, setAvailableSlot] = useState([])
      const location = useLocation();
      const initialSlot = location.state?.item;  
      const initialValue = {
        timeStart: initialSlot?.timeStart ? moment(initialSlot.timeStart, "HH:mm").format("HH:mm") : "",
      };
      const [selectedSlot, setSelectedSlot] = useState('')
    useEffect(() => {
        const loadSlots = async () => {
          try {
            const response = await getAll();
            const slots = response.data.result.map(slot => ({
                value: moment(slot.timeStart, 'HH:mm').format('HH:mm')   
            }));
            setAvailableSlot(slots)
          } catch (error) {
            console.error("Error loading slots:", error);
          }
        };
        loadSlots();
      }, []); 
      
    
    const onSelect = (time) => {
      if(time){
        setSelectedSlot(time.format('HH:mm'));
      }else{
        setSelectedSlot(initialValue.timeStart);
      }
    };
      const inputs = [
        {
            label: 'Thời gian',
            name:'timeStart',
            isTime: true,
            rules: [{required: true, message: 'Vui lòng chọn thời gian!',
                validator: (_, selectedSlot) => {
                    if (availableSlot.some(slot => slot.value === selectedSlot)) {
                        notification.error({
                            message: 'Thời gian trùng lặp',
                            description: 'Thời gian bạn chọn đã tồn tại, vui lòng chọn thời gian khác!',
                            duration: 2 
                        });
                        return Promise.reject('Thời gian này đã tồn tại');
                    }else if(!selectedSlot){
                        notification.error({
                            message: 'Thời gian bị trống',
                            description: 'Thời gian đang bị bỏ trống!',
                            duration: 2 
                        });
                        return Promise.reject('Thời gian không được bỏ trống');
                    }
                    return Promise.resolve();
                }
            }],
            onChange: onSelect
        }
      ]
    const back = useNavigate()
    const handleCreate = async (value) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có muốn thêm mới khung giờ này ?',
            onOk: async () => {
                try {
                    const response = await update(value)
                    notification.success({
                      message: 'Thành công',
                      description: 'Khung giờ đã được thêm mới!',
                      duration: 2
                    });
                  setTimeout(() => {
                    back('/admin/slot', { state: { shouldReload: true } })
                  }, 1000)
                    return response
                } catch (error) {
                    console.error(error);
                    notification.error({
                        message: 'Thất bại',
                        description: 'Thêm mới khung giờ thất bại!',
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
        
    }
  return (
    <>
    <NavLink currentPage='Cập nhật khung giờ'/>
    <CUForm inputs={inputs} handleSave={handleCreate} initialValues={initialValue} />
    </>
  )
}

export default UpdateSlot