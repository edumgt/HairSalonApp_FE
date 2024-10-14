import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import HeaderButton from '../../../layouts/admin/components/table/button/headerButton'
import styles from './service.module.css'
import EditButton from '../../../layouts/admin/components/table/button/editButton'
import { Modal } from 'antd'

const ListItem = ({ serviceId, serviceName, description, duration, price, categories, image, onEdit, onDelete }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    // Hàm để chuyển đổi URL imgur thành URL trực tiếp của hình ảnh
    const getImgurDirectUrl = (url) => {
        if (!url) return '';
        const imgurRegex = /https?:\/\/(?:i\.)?imgur\.com\/(\w+)(?:\.\w+)?/;
        const match = url.match(imgurRegex);
        if (match && match[1]) {
            return `https://i.imgur.com/${match[1]}.jpg`;
        }
        return url;
    };

    const imageUrl = getImgurDirectUrl(image);

    return (
        <tr className={styles.row}>
            <td className={styles.info}>{serviceId}</td>
            <td className={styles.info}>{categories.categoryId}</td>
            <td className={styles.info}>{serviceName}</td>
            <td className={styles.info}>{description}</td>
            <td className={styles.info}>{duration}</td>
            <td className={styles.info}>{price.toLocaleString()} VND</td>
            <td className={`${styles.info} ${styles.imageCell}`}>
                {!imageError ? (
                    <img 
                        src={imageUrl} 
                        alt={serviceName} 
                        className={styles.serviceImage} 
                        onError={handleImageError}
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>No Image</div>
                )}
            </td>
            <td className={styles.actionCell}>
                <EditButton onEdit={() => onEdit(serviceId)} onDelete={() => onDelete(serviceId)}/>
            </td>
        </tr>
    )
}

const Service = () => {
    const navigate = useNavigate()
    const [services, setServices] = useState([])
    const [filteredServices, setFilteredServices] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/service')
            if (response.data && response.data.code === 0) {
                setServices(response.data.result)
                setFilteredServices(response.data.result)
            } else {
                throw new Error('Failed to fetch services')
            }
        } catch (err) {
            setError('An error occurred while fetching services')
            console.error('Error fetching services:', err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const filtered = services.filter(service => 
            service.serviceName.toLowerCase().includes(searchText.toLowerCase())
        )
        setFilteredServices(filtered)
    }, [searchText, services])

    const handleAddService = () => {
        navigate('addService')
    }

    const handleEditService = (serviceId) => {
        navigate(`/service/updateService/${serviceId}`)
    }

    const handleDeleteService = (serviceId) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa dịch vụ này không?',
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:8080/api/v1/service/${serviceId}`);
                    Modal.success({
                        content: 'Xóa dịch vụ thành công',
                    });
                    fetchServices(); // Cập nhật lại danh sách sau khi xóa
                } catch (error) {
                    console.error('Lỗi khi xóa dịch vụ:', error);
                    Modal.error({
                        content: 'Có lỗi xảy ra khi xóa dịch vụ',
                    });
                }
            },
        });
    };

    const handleSearch = (value) => {
        setSearchText(value)
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className={styles.main}>
            <NavLink currentPage="Service" />
            <div className={styles.tableGroup}>
                <HeaderButton 
                    text="Add service" 
                    add={true} 
                    onClick={handleAddService} 
                    onSearch={handleSearch}
                />
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.columnHeaderParent}>
                                <HeaderColumn title="Service ID" sortable />
                                <HeaderColumn title="Category ID" sortable />
                                <HeaderColumn title="Service Name" sortable />
                                <HeaderColumn title="Description" />
                                <HeaderColumn title="Duration" />
                                <HeaderColumn title="Price" sortable />
                                <HeaderColumn title="Image" className={styles.imageHeader} />
                                <HeaderColumn title="" />
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service) => (
                                <ListItem 
                                    key={service.serviceId} 
                                    {...service} 
                                    onEdit={handleEditService} 
                                    onDelete={handleDeleteService}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Service
