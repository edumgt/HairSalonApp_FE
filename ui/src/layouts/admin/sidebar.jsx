import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './sidebar.module.css';

import menuIcon from '../../assets/admin/menu.svg'
import dashboardIcon from '../../assets//admin/chart.svg'
import profileIcon from '../../assets//admin/profile.svg'
import staffIcon from '../../assets//admin/staff.svg'
import comboIcon from '../../assets/admin/combo.svg'
import bookingIcon from '../../assets//admin/booking.svg'
import logoutIcon from '../../assets//admin/Fill.svg'
import serviceIcon from '../../assets/admin/serviceIcon.svg'
import categoryIcon from '../../assets/admin/category.svg'
import slotIcon from '../../assets/admin/slot.svg'
import salonIcon from '../../assets/admin/store.svg'

const Sidebar = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
    }, []);

    const handleItem = useCallback((path, item) => {
        setActiveItem(item);
        navigate(path);
    }, [navigate]);

    const toggleSidebar = () => {
        setIsVisible(!isVisible);
    };

    const forAdminAndManager = userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'admin' || userRole === 'manager';
    const forManager = userRole === 'MANAGER' || userRole === 'manager';
    return (
        <div className={`${styles.nav} ${isVisible ? '' : styles.toggle}`}>
            <div className={styles.brand}>
                <img className={styles.menuIcon} alt="" src={menuIcon} onClick={toggleSidebar} />
                <i className={styles.brandsName}>30Shine</i>
            </div>
            <div className={styles.navs}>
                {forAdminAndManager && (
                    <div className={styles.item}>
                        <div className={styles.itemGroup}>
                            <img className={styles.navIcon} alt="" src={dashboardIcon}  />
                            <div className={styles.itemContent}>Trang chủ</div>
                        </div>
                    </div>
                )}
                <div className={`${styles.item} ${activeItem === 'adminprofile' ? styles.active : ''}`} 
                    onClick={() => handleItem('/admin/adminprofile', 'adminprofile')}>
                    <div className={styles.itemGroup}>
                        <img className={styles.navIcon} alt="" src={profileIcon} />
                        <div className={styles.itemContent}>Thông tin cá nhân</div>
                    </div>
                </div>
                <div className={`${styles.item} ${activeItem === 'staff' ? styles.active : ''}`} 
                    onClick={() => handleItem('/admin/staff', 'staff')}>
                    <div className={styles.itemGroup}>
                        <img className={styles.navIcon} alt="" src={staffIcon} />
                        <div className={styles.itemContent}>Nhân viên</div>
                    </div>
                </div>
                
                <div className={`${styles.item} ${activeItem === 'booking' ? styles.active : ''}`} 
                    onClick={() => handleItem('/admin/historybooking', 'booking')}>
                    <div className={styles.itemGroup}>
                        <img className={styles.navIcon} alt="" src={bookingIcon} />
                        <div className={styles.itemContent}>Đặt lịch</div>
                    </div>
                </div>
                {forAdminAndManager && (
                    <>
                        {!forManager && (
                            <div className={`${styles.item} ${activeItem === 'manager' ? styles.active : ''}`} 
                                onClick={() => handleItem('/admin/manager', 'manager')}>
                                <div className={styles.itemGroup}>
                                <img className={styles.navIcon} alt="" src={staffIcon} />
                                <div className={styles.itemContent}>Quản lý</div>
                                </div>
                            </div>
                        )}
                        <div className={`${styles.item} ${activeItem === 'combo' ? styles.active : ''}`} 
                            onClick={() => handleItem('/admin/combo', 'combo')}>
                            <div className={styles.itemGroup}>
                                <img className={styles.navIcon} alt="" src={comboIcon} />
                                <div className={styles.itemContent}>Combo</div>
                            </div>
                        </div>
                        <div className={`${styles.item} ${activeItem === 'slot' ? styles.active : ''}`} 
                            onClick={() => handleItem('/admin/slot', 'slot')}>
                            <div className={styles.itemGroup}>
                                <img className={styles.navIcon} alt="" src={slotIcon} />
                                <div className={styles.itemContent}>Khung giờ</div>
                            </div>
                        </div>
                        <div className={`${styles.item} ${activeItem === 'service' ? styles.active : ''}`} 
                            onClick={() => handleItem('/admin/service', 'service')}>
                            <div className={styles.itemGroup}>
                                <img className={styles.navIcon} alt="" src={serviceIcon} />
                                <div className={styles.itemContent}>Dịch vụ</div>
                            </div>
                        </div>
                        <div className={`${styles.item} ${activeItem === 'category' ? styles.active : ''}`} 
                            onClick={() => handleItem('/admin/category', 'category')}>
                            <div className={styles.itemGroup}>
                                <img className={styles.navIcon} alt="" src={categoryIcon} />
                                <div className={styles.itemContent}>Danh mục</div>
                            </div>
                        </div>
                        {!forManager && (
                            <div className={`${styles.item} ${activeItem === 'salon' ? styles.active : ''}`} 
                                onClick={() => handleItem('/admin/salon', 'salon')}>
                                <div className={styles.itemGroup}>
                                <img className={styles.navIcon} alt="" src={salonIcon} />
                                <div className={styles.itemContent}>Chi nhánh</div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className={`${styles.logout} ${activeItem === 'logout' ? styles.active : ''}`} 
                onClick={() => handleItem('./pages/Home', 'logout')}>
                {/* <div className={styles.logout}> */}
                    <img className={styles.logoutIcon} alt="" src={logoutIcon} />
                    <div className={styles.logoutBtn}>Quay lại</div>
                {/* </div> */}
            </div>
        </div>
    );
};

export default Sidebar;
