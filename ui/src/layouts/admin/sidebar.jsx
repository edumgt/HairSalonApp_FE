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

const Sidebar = () => {
        
		const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
	  
		// Hàm điều hướng đến trang "Dashboard"
		// const onDashboardClick = useCallback(() => {
		//   navigate('/dashboard'); // Điều hướng đến trang Dashboard
		// }, [navigate]);
	  
		// const onProfileClick = useCallback(() => {
		//   navigate('/profile'); // Điều hướng đến trang Profile
		// }, [navigate]);
	  
		// const onSalonClick = useCallback(() => {
		//   navigate('/salon'); // Điều hướng đến trang Salon
		// }, [navigate]);
        
        const [activeItem, setActiveItem] = useState(null)
        const handleItem = useCallback((path, item) => {
        setActiveItem(item);
        navigate(path);
        }, {navigate});

  	return (
    		<div className={styles.nav}>
      			{/* <div className={styles.bg} />  */}
				  <div className={styles.brand}>
        				<img className={styles.menuIcon} alt="" src={menuIcon} />
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
      			</div>
				  	<div className={styles.logout}>
        				<img className={styles.logoutIcon} alt="" src={logoutIcon} />
        				<div className={styles.logoutBtn}>Logout</div>
      				</div>
    		</div>);
};

export default Sidebar;
