import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Spin, message, Button, Form, Input } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, StarOutlined, EditOutlined } from '@ant-design/icons';
import './index.scss';

const { Title, Text } = Typography;

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

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
        form.setFieldsValue(data.result);
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

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    form.setFieldsValue(profile);
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        ...values,
        role: profile.role // Giữ nguyên giá trị role hiện tại
      };
      const response = await fetch('http://localhost:8080/api/v1/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile.result);
      setEditing(false);
      message.success('Cập nhật thông tin thành công');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    }
  };

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
        <Title level={2}>{`${profile.firstName} ${profile.lastName}`}</Title>
        {editing ? (
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="firstName" label="Họ" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Lưu</Button>
              <Button onClick={handleCancel} style={{ marginLeft: 8 }}>Hủy</Button>
            </Form.Item>
          </Form>
        ) : (
          <div className="profile-info">
            <p><PhoneOutlined /> <Text strong>Số điện thoại:</Text> {profile.phone}</p>
            <p><MailOutlined /> <Text strong>Email:</Text> {profile.email}</p>
            <p><StarOutlined /> <Text strong>Điểm tích lũy:</Text> {profile.shinePoint}</p>
            <Button icon={<EditOutlined />} onClick={handleEdit}>Chỉnh sửa</Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default UserProfile;
