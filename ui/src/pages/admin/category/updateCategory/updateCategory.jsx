import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './updateCategory.module.css';

function UpdateCategory() {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const { categoryId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/category/${categoryId}`);
                if (response.data && response.data.result) {
                    setCategoryName(response.data.result.categoryName);
                    setCategoryDescription(response.data.result.categoryDescription);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin danh mục:', error);
                setNotification({ message: 'Không thể lấy thông tin danh mục. Vui lòng thử lại sau.', type: 'error' });
            }
        };

        fetchCategory();
    }, [categoryId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '' });

        if (!categoryName.trim() || !categoryDescription.trim()) {
            setNotification({ message: 'Vui lòng điền đầy đủ thông tin.', type: 'error' });
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8080/api/v1/category/${categoryId}`, {
                categoryName,
                categoryDescription
            });

            if (response.data && response.data.code === 0) {
                setNotification({ message: 'Cập nhật danh mục thành công!', type: 'success' });
                setTimeout(() => navigate('/category'), 2000);
            } else {
                setNotification({ message: 'Có lỗi xảy ra khi cập nhật danh mục.', type: 'error' });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật danh mục:', error);
            setNotification({ message: 'Có lỗi xảy ra khi cập nhật danh mục. Vui lòng thử lại sau.', type: 'error' });
        }
    };

    return (
        <div className={styles.updateCategoryContainer}>
            <h2>Cập Nhật Danh Mục</h2>
            {notification.message && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="categoryName">Tên Danh Mục:</label>
                    <input
                        type="text"
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="categoryDescription">Mô Tả Danh Mục:</label>
                    <textarea
                        id="categoryDescription"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.submitButton}>Cập Nhật Danh Mục</button>
                    <button type="button" className={styles.cancelButton} onClick={() => navigate('/category')}>Hủy</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateCategory;
