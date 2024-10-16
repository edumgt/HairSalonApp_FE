import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './createCategory.module.css';

function CreateCategory() {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '' });

        if (!categoryName.trim() || !categoryDescription.trim()) {
            setNotification({ message: 'Please fill in all information.', type: 'error' });
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/v1/category', {
                categoryName,
                categoryDescription
            });

            if (response.data.code === 0) {
                setNotification({ message: 'Category added successfully!', type: 'success' });
                setTimeout(() => navigate('/category'), 2000); // Redirect after 2 seconds
            } else {
                setNotification({ message: 'An error occurred while adding the category.', type: 'error' });
            }
        } catch (error) {
            console.error('Error adding category:', error);
            setNotification({ message: 'An error occurred while adding the category. Please try again later.', type: 'error' });
        }
    };

    return (
        <div className={styles.createCategoryContainer}>
            <h2>Add New Category</h2>
            {notification.message && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="categoryName">Category Name:</label>
                    <input
                        type="text"
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="categoryDescription">Category Description:</label>
                    <textarea
                        id="categoryDescription"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.submitButton}>Add Category</button>
                    <button type="button" className={styles.cancelButton} onClick={() => navigate('/category')}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default CreateCategory;
