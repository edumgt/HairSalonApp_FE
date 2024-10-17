import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Spin, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, StarOutlined } from '@ant-design/icons';
import './index.scss';

const { Title, Text } = Typography;

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Vui lòng đăng nhập để xem thông tin');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8080/api/v1/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        if (data.result) {
          setProfile(data.result);
        } else {
          throw new Error('Profile data not found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        message.error('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!profile) {
    return <Text>Không có thông tin người dùng.</Text>;
  }

  return (
    <div className="user-profile-container">
      <Card className="profile-card">
        <Avatar size={100} icon={<UserOutlined />} className="profile-avatar" />
        <Title level={2} className="profile-name">{`${profile.firstName} ${profile.lastName}`}</Title>
        <div className="profile-info">
          <p><PhoneOutlined /> <Text strong>Số điện thoại:</Text> {profile.phone}</p>
          <p><MailOutlined /> <Text strong>Email:</Text> {profile.email}</p>
          <p><StarOutlined /> <Text strong>Điểm tích lũy:</Text> {profile.shinePoint}</p>
        </div>
      </Card>
    </div>
  );
}

export default UserProfile;