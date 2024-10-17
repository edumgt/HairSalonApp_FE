import styles from './profile.module.css';
import avatar from '../../../assets/admin/profileIcon.svg'
import NavLink from '../../../layouts/admin/components/link/navLink'
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useContext } from 'react';
import { UserContext } from './userContext'
const Profile = () => {
	const navigate = useNavigate();
	const user = useContext(UserContext)
  	return (
    		<div className={styles.main}>
      			<NavLink currentPage="Bạn" />
      			<div className={styles.mainContent}>
        				<img className={styles.profileAvatar} alt="" src={avatar} />
        				<div className={styles.profileParent}>
							<div className={styles.profileHeader}>Về tôi</div>
          					<div className={styles.infoGroup}>
								<div className={styles.infoChild}>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>ID</div>
										<div className={styles.info}>{user.id}</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Họ tên</div>
										<div className={styles.info}>{user.fullName}</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Vai trò</div>
										<div className={styles.info}>{user.role}</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Email</div>
										<div className={styles.info}>{user.email}</div>
									</div>
									<div className={styles.infoParent}>
										<div className={styles.infoTitle}>Số điện thoại</div>
										<div className={styles.info}>{user.phone}</div>
									</div>
								</div>
          					</div>
							
								<Button type='primary'
									className={styles.editProfileButton} onClick={() => navigate('/editProfile')}>
											<div className={styles.changePassword}>Chỉnh sửa thông tin</div>
          						</Button>
        				</div>
        				<div className={styles.accountParent}>
          					<div className={styles.accountHeader}>Tài khoản</div>
          					<div className={styles.accountGroup}>
            						<div className={styles.infoChild}>
              							<div className={styles.infoParent}>
                								<div className={styles.infoTitle}>Tên tài khoản</div>
                								<div className={styles.info}>{user.userName}</div>
              							</div>
              							<div className={styles.infoParent}>
                								<div className={styles.infoTitle}>Mật khẩu</div>
                								<div className={styles.info}>{user.pass}</div>
              							</div>
            						</div>
          					</div>
          					<Button type='primary'
							 className={styles.changePasswordButton} onClick={() => navigate('/changePassword')}>
            						<div className={styles.changePassword}>Đổi mật khẩu</div>
          					</Button>
        				</div>
      			</div>
    		</div>
			);
};

export default Profile;
