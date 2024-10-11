import React, { useState } from 'react'
import styles from './addService.module.css'

const AddService = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Xử lý logic gửi dữ liệu ở đây
        console.log(formData)
        // Sau khi xử lý xong, đóng modal
        onClose()
    }

    return (
        <div className={styles.addServiceContainer}>
            <h2>Thêm Dịch Vụ Mới</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Tên dịch vụ:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
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
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="price">Giá (VNĐ):</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="duration">Thời gian (phút):</label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button type="button" onClick={onClose} className={styles.cancelButton}>Hủy</button>
                    <button type="submit" className={styles.saveButton}>Lưu</button>
                </div>
            </form>
        </div>
    )
}

export default AddService