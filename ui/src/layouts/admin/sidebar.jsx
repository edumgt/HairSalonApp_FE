import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './sidebar.module.css';

import menuIcon from '../../assets/admin/menu.svg'
import dashboardIcon from '../../assets//admin/chart.svg'
import profileIcon from '../../assets//admin/profile.svg'
import salonIcon from '../../assets//admin/store.svg'
import staffIcon from '../../assets//admin/staff.svg'
import wageIcon from '../../assets//admin/coins.svg'
import bookingIcon from '../../assets//admin/booking.svg'
import logoutIcon from '../../assets//admin/Fill.svg'
import serviceIcon from '../../assets/admin/serviceIcon.svg'
import categoryIcon from '../../assets/admin/categoryIcon.svg'
const Sidebar = () => {
        
		const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
        
        const [activeItem, setActiveItem] = useState(null)
        const handleItem = useCallback((path, item) => {
			setActiveItem(item);
			navigate(path);
        }, [navigate]);

        const [isVisible, setIsVisible] = useState(true)
        const toggleSidebar = () => {
            setIsVisible(!isVisible);
        };

  	return (
    		<div className={`${styles.nav} ${isVisible ? '' : styles.toggle}`}>
				  <div className={styles.brand}>
        				<img className={styles.menuIcon} alt="" src={menuIcon} onClick={toggleSidebar}/>
        				<i className={styles.brandsName}>Brand’s name</i>
      			</div>
      			<div className={styles.navs}>
        				<div className={styles.item}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={dashboardIcon} />
            						<div className={styles.itemContent}>Dashboard</div>
          					</div>
        				</div>
        				<div className={`${styles.item} ${activeItem === 'profile' ? styles.active : ''}`} 
                            onClick={() => handleItem('/profile', 'profile')}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={profileIcon} />
            						<div className={styles.itemContent}>Profile</div>
          					</div>
        				</div>
        				<div className={`${styles.item} ${activeItem === 'salon' ? styles.active : ''}`} 
                            onClick={() => handleItem('/salon', 'salon')}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={salonIcon}/>
            						<div className={styles.itemContent}>Salon</div>
          					</div>
        				</div>
        				<div className={`${styles.item} ${activeItem === 'staff' ? styles.active : ''}`} 
                            onClick={() => handleItem('/staff', 'staff')}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={staffIcon} />
            						<div className={styles.itemContent}>Staff</div>
          					</div>
        				</div>
        				<div className={`${styles.item} ${activeItem === 'wage' ? styles.active : ''}`} 
                            onClick={() => handleItem('/wage', 'wage')}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={wageIcon} />
            						<div className={styles.itemContent}>Wage</div>
          					</div>
        				</div>
        				<div className={`${styles.item} ${activeItem === 'booking' ? styles.active : ''}`} 
                            onClick={() => handleItem('/booking', 'booking')}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={bookingIcon} />
            						<div className={styles.itemContent}>Booking</div>
          					</div>
        				</div>
						<div className={`${styles.item} ${activeItem === 'service' ? styles.active : ''}`} 
                            onClick={() => handleItem('/service', 'service')}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={serviceIcon} />
            						<div className={styles.itemContent}>Service</div>
          					</div>
        				</div>
						<div className={`${styles.item} ${activeItem === 'category' ? styles.active : ''}`} 
                            onClick={() => handleItem('/category', 'category')}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={categoryIcon} />
            						<div className={styles.itemContent}>Category</div>
          					</div>
        				</div>
      			</div>
				  	<div className={styles.logout}>
        				<img className={styles.logoutIcon} alt="" src={logoutIcon} />
        				<div className={styles.logoutBtn}>Logout</div>
      				</div>
    		</div>);
};

export default Sidebar;
