import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import HeaderButton from '../../../layouts/admin/components/table/button/headerButton'
import styles from './category.module.css'
import { Modal } from 'antd'
import UpdateCategoryForm from './updateCategory'
import { useLocation, useNavigate } from 'react-router-dom'

const ListItem = ({categoryId, categoryName, categoryDescription, onEdit}) => {
    return(
        <tr 
            className={`${styles.row} ${styles.clickable}`}
            onClick={() => onEdit({ categoryId, categoryName, categoryDescription })}
        >
            <td className={styles.info}>{categoryId}</td>
            <td className={styles.info}>{categoryName}</td>
            <td className={styles.info}>{categoryDescription}</td>
        </tr>
    )
}

function Category() {
    const [categories, setCategories] = useState([]);
    const [searchText, setSearchText] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const isRootPath = location.pathname === '/admin/category';
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/category', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data && Array.isArray(response.data.result)) {
                setCategories(response.data.result);
            } else {
                console.error('Dữ liệu trả về không hợp lệ:', response.data);
                setCategories([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = () => {
        navigate('/admin/category/addCategory/createCategory');
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setIsUpdateModalVisible(true);
    };

    const handleUpdateModalCancel = () => {
        setIsUpdateModalVisible(false);
        setSelectedCategory(null);
    };

    const handleUpdateSuccess = () => {
        setIsUpdateModalVisible(false);
        setSelectedCategory(null);
        fetchCategories();
    };

    const handleDeleteCategory = (categoryId) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có muốn xóa danh mục này ?',
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:8080/api/v1/category/${categoryId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    Modal.success({
                        content: 'Xóa danh mục thành công',
                    });
                    fetchCategories();
                } catch (error) {
                    console.error('Error deleting category:', error);
                    Modal.error({
                        content: 'Có lỗi xảy ra khi xóa danh mục',
                    });
                }
            },
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        });
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredCategories = categories.filter(category => 
        category.categoryName.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className={styles.main}>
            {isRootPath ? (
                <>
                    <NavLink currentPage="Danh mục" />
                    <div className={styles.tableGroup}>
                        <HeaderButton 
                            text="Thêm danh mục" 
                            add={true} 
                            onClick={handleAddCategory} 
                            onSearch={handleSearch}
                            searchText='tên danh mục'
                        />
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.columnHeaderParent}>
                                        <HeaderColumn title="ID danh mục" sortable />
                                        <HeaderColumn title="Tên danh mục" sortable />
                                        <HeaderColumn title="Mô tả" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((category) => (
                                            <ListItem 
                                                key={category.categoryId}
                                                categoryId={category.categoryId}
                                                categoryName={category.categoryName}
                                                categoryDescription={category.categoryDescription}
                                                onEdit={handleEditCategory}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{textAlign: 'center'}}>Không tìm thấy danh mục.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <UpdateCategoryForm 
                        visible={isUpdateModalVisible}
                        onCancel={handleUpdateModalCancel}
                        onSuccess={handleUpdateSuccess}
                        initialValues={selectedCategory}
                        onDelete={handleDeleteCategory}
                    />
                </>
            ) : (
                <Outlet/>
            )}
        </div>
    )
}

export default Category
