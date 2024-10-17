import React, { useEffect, useState } from 'react'
import NavLink from '../../../layouts/admin/components/link/navLink'
import { useNavigate } from 'react-router-dom'
import { Modal, notification } from 'antd'
import CUForm from '../../../layouts/admin/components/formv2/form'
import { create, getServices } from '../services/comboService'

function AddCombo() {
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
    const inputs = [
        {
            label: 'Tên Combo',
            name:'name',
            isInput: true,
            rules: [{required: true, message: 'Vui lòng nhập Tên!'}]
        },
        {
            label: 'Giá',
            name:'price',
            isInput: true,
            rules: [{required: true, message: 'Vui lòng nhập Giá!'}]
        },
        {
            label: 'Mô tả',
            name:'description',
            isInput: true,
            rules: [{required: true, message: 'Vui lòng nhập Mô tả!'}]
        },
        {
            label: 'Các dịch vụ',
            name:'services',
            isSelect: true,
            mode: 'multiple',
            options: serviceOptions,
            rules: [{required: true, message: 'Vui lòng nhập Các dịch vụ!'}]
        }
    ]
    const back = useNavigate()
    const handleCreate = async (values) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có muốn thêm mới combo này ?',
            onOk: async () => {
                try {
                    const response = await create(values)
                    notification.success({
                      message: 'Thành công',
                      description: 'Combo đã được thêm mới!',
                      duration: 2
                    });
                  setTimeout(() => {
                    back('/admin/combo', { state: { shouldReload: true } })
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
    <><NavLink currentPage='Combo' hasChild={true} nextPage='Add combo' />
    <CUForm inputs={inputs} handleSave={handleCreate}/></>
  )
}

export default AddCombo