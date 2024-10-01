import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './sidebar.module.css';

// import menuIcon from '../assets/Menu icon.svg'
// import dashboardIcon from '../assets/chart.svg'
// import profileIcon from '../assets/profile.svg'
// import salonIcon from '../assets/store.svg'
// import staffIcon from '../assets/staff.svg'
// import wageIcon from '../assets/coins.svg'
// import bookingIcon from '../assets/booking.svg'
// import logoutIcon from '../assets/Fill.svg'

const Sidebar = () => {
		const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
	  
		// Hàm điều hướng đến trang "Dashboard"
		// const onDashboardClick = useCallback(() => {
		//   navigate('/dashboard'); // Điều hướng đến trang Dashboard
		// }, [navigate]);
	  
		const onProfileClick = useCallback(() => {
		  navigate('/profile'); // Điều hướng đến trang Profile
		}, [navigate]);
	  
		const onSalonClick = useCallback(() => {
		  navigate('/salon'); // Điều hướng đến trang Salon
		}, [navigate]);


  	return (
    		<div className={styles.nav}>
      			<div className={styles.bg} /> 
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
        				<div className={styles.item} onClick={onProfileClick}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={profileIcon} />
            						<div className={styles.itemContent}>Profile</div>
          					</div>
        				</div>
        				<div className={styles.item} onClick={onSalonClick}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={salonIcon}/>
            						<div className={styles.itemContent}>Salon</div>
          					</div>
        				</div>
        				<div className={styles.item}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={staffIcon} />
            						<div className={styles.itemContent}>Staff</div>
          					</div>
        				</div>
        				<div className={styles.item}>
          					<div className={styles.itemGroup}>
            						<img className={styles.navIcon} alt="" src={wageIcon} />
            						<div className={styles.itemContent}>Wage</div>
          					</div>
        				</div>
        				<div className={styles.item}>
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
