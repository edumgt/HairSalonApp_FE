import styles from './profile.module.css';
import avatar from '../../../assets/admin/profileIcon.svg'
import NavLink from '../../../layouts/admin/navLink'
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useContext } from 'react';
import { UserContext } from './userContext'
const Profile = () => {
	const navigate = useNavigate();
	const user = useContext(UserContext)
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
										<div className={styles.infoTitle}>ID</div>
										<div className={styles.info}>{user.id}</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Full name</div>
										<div className={styles.info}>{user.fullName}</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Role</div>
										<div className={styles.info}>{user.role}</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Email</div>
										<div className={styles.info}>{user.email}</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Phone number</div>
										<div className={styles.info}>{user.phone}</div>
									</div>
								</div>
          					</div>
							
								<Button type='primary'
									className={styles.editProfileButton} onClick={() => navigate('/editProfile')}>
											<div className={styles.changePassword}>Edit profile</div>
          						</Button>
        				</div>
        				<div className={styles.accountParent}>
          					<div className={styles.accountHeader}>Account</div>
          					<div className={styles.accountGroup}>
            						<div className={styles.infoChild}>
              							<div className={styles.infoParent}>
                								<div className={styles.infoTitle}>User name</div>
                								<div className={styles.info}>{user.userName}</div>
              							</div>
              							<div className={styles.infoParent}>
                								<div className={styles.infoTitle}>Password</div>
                								<div className={styles.info}>{user.pass}</div>
              							</div>
            						</div>
          					</div>
          					<Button type='primary'
							 className={styles.changePasswordButton} onClick={() => navigate('/changePassword')}>
            						<div className={styles.changePassword}>Change password</div>
          					</Button>
        				</div>
      			</div>
    		</div>
			);
};

export default Profile;
