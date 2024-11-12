import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './updateService.module.css'

const UpdateService = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        serviceName: '',
        serviceDescription: '',
        duration: '',
        price: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        try {
            const response = await axios.put('http://localhost:8080/api/v1/service', 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            if (response.data && response.data.code === 0) {
                setSuccess('Service updated successfully')
                setTimeout(() => navigate('/service'), 2000)
            } else {
                setError('Failed to update service')
            }
        } catch (err) {
            console.error('Error updating service:', err)
            setError('An error occurred while updating the service. Please try again.')
        }
    }

    return (
        <div className={styles.updateServiceContainer}>
            <h2>Update Service</h2>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="serviceName">Service Name:</label>
                    <input 
                        type="text" 
                        id="serviceName"
                        name="serviceName"
                        value={formData.serviceName}
                        onChange={handleChange}
                        placeholder="Enter service name"
                    />
                </div>
                <div>
                    <label htmlFor="serviceDescription">Service Description:</label>
                    <textarea 
                        id="serviceDescription"
                        name="serviceDescription"
                        value={formData.serviceDescription}
                        onChange={handleChange}
                        placeholder="Enter service description"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="duration">Duration (Minutes):</label>
                    <input 
                        type="number" 
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="Enter duration in minutes"
                    />
                </div>
                <div>
                    <label htmlFor="price">Price (VND):</label>
                    <input 
                        type="number" 
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price in VND"
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
