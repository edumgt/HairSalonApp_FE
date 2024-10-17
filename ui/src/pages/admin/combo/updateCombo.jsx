import { useLocation, useNavigate } from "react-router-dom"
import NavLink from "../../../layouts/admin/components/link/navLink"
import { Modal, notification } from "antd";
import CUForm from "../../../layouts/admin/components/formv2/form";
import { getServices, update } from "../services/comboService";
import { useEffect, useState } from "react";

function UpdateCombo() {
    const [serviceOptions, setServiceOptions] = useState([]);
    useEffect(() => {
        const loadServices = async () => {
          try {
            const response = await getServices();
            const services = response.data.result.map(service => ({
              label: service.serviceName,  
              value: service.serviceId     
            }));
            setServiceOptions(services);
          } catch (error) {
            console.error("Error loading services:", error);
          }
        };
        
        loadServices();
      }, []); 
    const location = useLocation();
    const combo = location.state?.item; 
    const initialValues = {
        id: combo?.id,
        name: combo?.name,
        services: combo?.services?.map(service => service.serviceId),
        price: combo?.price,
        description: combo?.description
    };
    const inputs = [
        {
            label: 'ID',
            name:'id',
            isInput: true,
            isDisabled: true,
        },
        {
            label: 'Tên Combo',
            name:'name',
            isInput: true,
            rules: [{required: true, message: 'Vui lòng nhập Tên!'}]
        },
        {
            label: 'Các dịch vụ',
            name:'services',
            isSelect: true,
            mode: 'multiple',
            options: serviceOptions,
            rules: [{required: true, message: 'Vui lòng chọn dịch vụ!'}]
        },
        {
            label: 'Giá',
            name:'price',
            isInput: true,
            rules: [{required: true, message: 'Vui lòng nhập giá!'}]
        },
        {
            label: 'Mô tả',
            name:'description',
            isInput: true,
            rules: [{required: true, message: 'Vui lòng nhập mô tả!'}]
        }
    ]
    const back = useNavigate()
    const handleUpdate = async (values) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có muốn cập nhật combo này ?',
            onOk: async () => {
                try {
                    const response = await update(values)
                    notification.success({
                        message: 'Thành công',
                        description: 'Combo đã được cập nhật!',
                        duration: 2
                      });
                    setTimeout(() => {
                        back('/combo', { state: { shouldReload: true } })
                    }, 1000)
                    return response
                } catch (error) {
                    console.log(error);
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
    <><NavLink currentPage='Combo' hasChild={true} nextPage='Update combo' />
    <CUForm inputs={inputs} handleSave={handleUpdate} initialValues={initialValues} /></>
  )
}

export default UpdateCombo