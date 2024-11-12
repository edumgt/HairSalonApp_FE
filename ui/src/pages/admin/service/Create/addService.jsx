import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './addService.module.css'

const AddService = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        categoryId: '',
        serviceName: '',
        description: '',
        duration: '',
        price: '',
        image: ''
    })
    const [categories, setCategories] = useState([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/category', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (response.data && response.data.code === 0) {
                    setCategories(response.data.result)
                }
            } catch (err) {
                console.error('Error fetching categories:', err)
                setError('Lấy dữ liệu dịch vụ thất bại')
            }
        }
        fetchCategories()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8080/api/v1/service', 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            if (response.data && response.data.code === 0) {
                setSuccess('Thêm dịch vụ thành công')
                setTimeout(() => navigate('/admin/service'), 2000)
            } else {
                setError('Thêm dịch vụ thất bại')
            }
        } catch (err) {
            console.error('Error adding service:', err)
            setError('Thêm dịch vụ thất bại')
        }
    }

    return (
        <div className={styles.addServiceContainer}>
            <h2>Thêm danh mục</h2>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="categoryId">Danh mục:</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="serviceName">Tên dịch vụ:</label>
                    <input
                        type="text"
                        id="serviceName"
                        name="serviceName"
                        value={formData.serviceName}
                        onChange={handleChange}
                        required
                        placeholder="Nhập tên dịch vụ"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Mô tả:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Nhập mô tả"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="duration">Thời gian (phút):</label>
                    <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        placeholder="Nhập thời gian theo phút"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="price">Giá (VND):</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        placeholder="Nhập giá theo VND"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="image">Hình ảnh (Imgur URL):</label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        required
                        placeholder="Nhập URL Imgur"
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button type="button" onClick={() => navigate('/admin/service')} className={styles.cancelButton}>Hủy</button>
                    <button type="submit" className={styles.saveButton}>Lưu</button>
                </div>
            </form>
        </div>
    )
}

export default AddService
