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
                const response = await axios.get(`http://localhost:8080/api/v1/category/${categoryId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data && response.data.code === 0 && response.data.result) {
                    setCategory(response.data.result);
                } else {
                    throw new Error('Lấy dữ liệu danh mục thất bại');
                }
            } catch (error) {
                console.error('Error fetching category information:', error);
                setNotification({ message: 'Lấy dữ liệu danh mục thất bại. Vui lòng thử lại', type: 'error' });
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
            setNotification({ message: 'Vui lòng điền đủ các thông tin.', type: 'error' });
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8080/api/v1/category`,
                {
                    categoryId: category.categoryId,
                    categoryName: category.categoryName,
                    categoryDescription: category.categoryDescription
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data && response.data.code === 0) {
                setNotification({ message: 'Cập nhật danh mục thành công!', type: 'success' });
                setTimeout(() => navigate('/admin/category'), 2000);
            } else {
                throw new Error('Có lỗi xảy ra khi cập nhật danh mục');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            setNotification({ message: 'Có lỗi xảy ra khi cập nhật danh mục. Vui lòng thử lại', type: 'error' });
        }
    };

    return (
        <div className={styles.updateCategoryContainer}>
            <h2>Cập nhật Danh mục</h2>
            {notification.message && (
                <div className={`${styles.notification} ${styles[notification.type]}`}>
                    {notification.message}
                </div>
            )}
            {isLoading ? (
                <div>Đang tải thông tin danh mục...</div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="categoryId">ID danh mục:</label>
                        <input
                            type="text"
                            id="categoryId"
                            name="categoryId"
                            value={category.categoryId}
                            readOnly
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="categoryName">Tên danh mục:</label>
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
                        <label htmlFor="categoryDescription">Mô tả:</label>
                        <textarea
                            id="categoryDescription"
                            name="categoryDescription"
                            value={category.categoryDescription}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.submitButton}>Cập nhật danh mục</button>
                        <button type="button" className={styles.cancelButton} onClick={() => navigate('/admin/category')}>Hủy</button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default UpdateCategory;
