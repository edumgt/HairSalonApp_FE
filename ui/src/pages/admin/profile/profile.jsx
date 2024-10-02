import styles from './profile.module.css';
import avatar from '../../../assets/admin/profileIcon.svg'
import NavLink from '../../../layouts/admin/navLink'

const Profile = () => {
  	return (
    		<div className={styles.main}>
      			<NavLink currentPage="Profile" />
      			<div className={styles.mainContent}>
        				<img className={styles.profileAvatar} alt="" src={avatar} />
        				<div className={styles.profileParent}>
							<div className={styles.profileHeader}>About you</div>
          					<div className={styles.infoGroup}>
								<div className={styles.infoChild}>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Full name</div>
										<div className={styles.info}>Lorem ipsum dolor sit amet</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Role</div>
										<div className={styles.info}>Lorem ipsum dolor sit amet</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>ID</div>
										<div className={styles.info}>Lorem</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Email</div>
										<div className={styles.info}>Lorem@example.com</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Phone number</div>
										<div className={styles.info}>xxx.xxx.xxx</div>
									</div>
								</div>
          					</div>
        				</div>
        				<div className={styles.accountParent}>
          					<div className={styles.accountHeader}>Account</div>
          					<div className={styles.accountGroup}>
            						<div className={styles.infoChild}>
              							<div className={styles.infoParent}>
                								<div className={styles.infoTitle}>User name</div>
                								<div className={styles.info}>Chris_Schinner</div>
              							</div>
              							<div className={styles.infoParent}>
                								<div className={styles.infoTitle}>Password</div>
                								<div className={styles.info}>xxx.xxx.xxx</div>
              							</div>
            						</div>
          					</div>
          					<button className={styles.changePasswordButton}>
            						<div className={styles.changePassword}>Change password</div>
          					</button>
        				</div>
      			</div>
    		</div>);
};

export default Profile;
