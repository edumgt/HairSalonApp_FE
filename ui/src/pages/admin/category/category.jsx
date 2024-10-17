import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import HeaderButton from '../../../layouts/admin/components/table/button/headerButton'
import styles from './category.module.css'
import EditButton from '../../../layouts/admin/components/table/button/editButton'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Modal } from 'antd'

const ListItem = ({categoryId, categoryName, categoryDescription, onEdit, onDelete}) => {
    return(
        <tr className={styles.row}>
            <td className={styles.info}>{categoryId}</td>
            <td className={styles.info}>{categoryName}</td>
            <td className={styles.info}>{categoryDescription}</td>
            <td className={styles.info} style={{ textAlign: 'center' }}>
                <EditButton onEdit={() => onEdit(categoryId)} onDelete={() => onDelete(categoryId)}/>
            </td>
        </tr>
    )
}

function Category() {
    const [categories, setCategories] = useState([]);
    const [searchText, setSearchText] = useState('');
    const location = useLocation()
    const navigate = useNavigate()
    
    const isRootPath = location.pathname === '/admin/category'

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/category');
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

    const handleAddCategory = () => {
        navigate('/admin/category/addCategory/createCategory');
    };

    const handleEditCategory = (categoryId) => {
        navigate(`/admin/category/updateCategory/${categoryId}`);
    };

    const handleDeleteCategory = (categoryId) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có muốn xóa danh mục này ?',
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:8080/api/v1/category/${categoryId}`);
                    Modal.success({
                        content: 'Xóa danh mục thành công',
                    });
                    fetchCategories(); // Update the list after deletion
                } catch (error) {
                    console.error('Error deleting category:', error);
                    Modal.error({
                        content: 'Có lỗi xảy ra khi xóa danh mục',
                    });
                }
            },
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
            {isRootPath 
                ? (
                    <><NavLink currentPage="Danh mục" />
                    <div className={styles.tableGroup}>
                        <HeaderButton 
                            text="Thêm danh mục" 
                            add={true} 
                            onClick={handleAddCategory} 
                            onSearch={handleSearch}
                        />
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.columnHeaderParent}>
                                        <HeaderColumn title="ID danh mục" sortable />
                                        <HeaderColumn title="Tên danh mục" sortable />
                                        <HeaderColumn title="Mô tả" />
                                        <HeaderColumn title="" align="center" />
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
                                                onDelete={handleDeleteCategory}
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
                    </div></>
                )
                : (
                    <Outlet/>
                )
            }
        </div>
    )
}

export default Category
