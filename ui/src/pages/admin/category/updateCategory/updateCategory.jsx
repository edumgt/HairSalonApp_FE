import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './updateCategory.module.css';

function UpdateCategory() {
    const [category, setCategory] = useState({
        categoryId: '',
        categoryName: '',
        categoryDescription: ''
    });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);
    const { categoryId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategory = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/category/${categoryId}`);
                if (response.data && response.data.code === 0 && response.data.result) {
                    setCategory(response.data.result);
                } else {
                    throw new Error('Unable to fetch category information');
                }
            } catch (error) {
                console.error('Error fetching category information:', error);
                setNotification({ message: 'Unable to fetch category information. Please try again later.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategory();
    }, [categoryId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory(prevCategory => ({
            ...prevCategory,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '' });

        if (!category.categoryName.trim() || !category.categoryDescription.trim()) {
            setNotification({ message: 'Please fill in all information.', type: 'error' });
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8080/api/v1/category`, {
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                categoryDescription: category.categoryDescription
            });

            if (response.data && response.data.code === 0) {
                setNotification({ message: 'Category updated successfully!', type: 'success' });
                setTimeout(() => navigate('/category'), 2000);
            } else {
                throw new Error('An error occurred while updating the category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            setNotification({ message: 'An error occurred while updating the category. Please try again later.', type: 'error' });
        }
    };

    return (
        <div className={styles.updateCategoryContainer}>
            <h2>Update Category</h2>
            {notification.message && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.message}
                </div>
            )}
            {isLoading ? (
                <div>Loading category information...</div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="categoryId">Category ID:</label>
                        <input
                            type="text"
                            id="categoryId"
                            name="categoryId"
                            value={category.categoryId}
                            readOnly
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="categoryName">Category Name:</label>
                        <input
                            type="text"
                            id="categoryName"
                            name="categoryName"
                            value={category.categoryName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="categoryDescription">Category Description:</label>
                        <textarea
                            id="categoryDescription"
                            name="categoryDescription"
                            value={category.categoryDescription}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.submitButton}>Update Category</button>
                        <button type="button" className={styles.cancelButton} onClick={() => navigate('/category')}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default UpdateCategory;
