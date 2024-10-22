import styles from './profile.module.css';
import avatar from '../../../assets/admin/profileIcon.svg'
import NavLink from '../../../layouts/admin/components/link/navLink'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { getProfile } from '../services/profileService';


const Profile = () => {
	const navigate = useNavigate();
	const location = useLocation()
	const [profile, setProfile] = useState({})
	const loadUser = async () => {
		try {
			const response = await getProfile()
			setProfile(response.data.result)
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		if (location.state?.shouldReload || location.state === null) {
			loadUser(); 
		}
	}, [location.state])

	const Info = ({title, info}) => {
		return (
			<div className={styles.infoParent}>
				<div className={styles.infoTitle}>{title}</div>
				<div className={styles.info}>{info}</div>
			</div>
		)
	}
  	return (
    		<div className={styles.main}>
      			<NavLink currentPage="Profile" />
      			<div className={styles.mainContent}>
        				<img className={styles.profileAvatar} alt="" src={avatar} />
        				<div className={styles.profileParent}>
							<div className={styles.profileHeader}>Về tôi</div>
          					<div className={styles.infoGroup}>
								<div className={styles.infoChild}>
									<Info title='ID' info={profile.id}/>
									<Info title='Full name' info={`${profile.firstName} ${profile.lastName}`}/>
									<Info title='Role' info={profile.role}/>
									<Info title='Email' info={profile.email}/>
									<Info title='Phone number' info={profile.phone}/>
								</div>
          					</div>
							
								<Button type='primary'
									className={styles.editProfileButton} onClick={() => navigate('editProfile', { state: { profile } })}>
											<div className={styles.changePassword}>Edit profile</div>
          						</Button>
								  <Button type='primary'
							 		className={styles.changePasswordButton} onClick={() => navigate('changePassword')}>
            						<div className={styles.changePassword}>Change password</div>
          					</Button>
        				</div>
      			</div>
    		</div>
			);
};

export default Profile;
