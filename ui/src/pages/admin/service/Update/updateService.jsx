import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './updateService.module.css'

const UpdateService = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        serviceName: '',
        serviceDescription: '',
        duration: '',
        price: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form data submitted:', formData)
        // Xử lý cập nhật dịch vụ ở đây (gọi API, etc.)
        navigate('/service')
    }

    return (
        <div className={styles.updateServiceContainer}>
            <h2>Update Service</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="serviceName">Service Name:</label>
                    <input 
                        type="text" 
                        id="serviceName"
                        name="serviceName"
                        value={formData.serviceName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="serviceDescription">Service Description:</label>
                    <textarea 
                        id="serviceDescription"
                        name="serviceDescription"
                        value={formData.serviceDescription}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="duration">Duration:</label>
                    <input 
                        type="text" 
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input 
                        type="text" 
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button type="button" onClick={() => navigate('/service')} className={styles.cancelButton}>Cancel</button>
                    <button type="submit" className={styles.saveButton}>Save Changes</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateService