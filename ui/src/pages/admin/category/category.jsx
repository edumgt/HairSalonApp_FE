import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavLink from '../../../layouts/admin/components/link/navLink'
import HeaderColumn from '../../../layouts/admin/components/table/headerColumn'
import HeaderButton from '../../../layouts/admin/components/table/button/headerButton'
import styles from './category.module.css'
import EditButton from '../../../layouts/admin/components/table/button/editButton'
import { Outlet, useLocation, Link } from 'react-router-dom'

const ListItem = ({categoryId, categoryName, categoryDescription}) => {
    return(
        <tr className={styles.row}>
            <td className={styles.info}>{categoryId}</td>
            <td className={styles.info}>{categoryName}</td>
            <td className={styles.info}>{categoryDescription}</td>
            <td>
                <EditButton/>
            </td>
        </tr>
    )
}

function Category() {
    const [categories, setCategories] = useState([]);
    const location = useLocation()
    
    const isRootPath = location.pathname === '/category'

    useEffect(() => {
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

        fetchCategories();
    }, []);

    return (
        <div className={styles.main}>
            {isRootPath 
                ? (
                    <><NavLink currentPage="Category" />
                    <div className={styles.tableGroup}>
                        <Link to="/category/addCategory/createCategory" className={styles.addCategoryLink} style={{ textDecoration: 'none' }}>
                            <HeaderButton text="Add category" add={true} />
                        </Link>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.columnHeaderParent}>
                                        <HeaderColumn title="Category ID" sortable />
                                        <HeaderColumn title="Category Name" sortable />
                                        <HeaderColumn title="Category Description" />
                                        <HeaderColumn title="" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <ListItem 
                                                key={category.categoryId}
                                                categoryId={category.categoryId}
                                                categoryName={category.categoryName}
                                                categoryDescription={category.categoryDescription}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{textAlign: 'center'}}>Không có danh mục nào.</td>
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
