import { Button,Form,Input,Layout,Select,Modal } from 'antd';
import { Content } from 'antd/es/layout/layout';
import styles from './editProfile.module.css'
import { useContext, useState } from 'react';
import { UserContext } from './userContext';
import { useNavigate } from 'react-router-dom';
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};
const EditProfile = () => {
    const user = useContext(UserContext)
    const navigate = useNavigate()
    const [info, setInfo] = useState(user)
    const handleChange = (event) =>{
        const name = event.target.name
        const value = event.target.defaultValue
        setInfo(user => ({...user, [name]: value}))
    }
    const editProfile = async () => {
        Modal.confirm({
          title: 'Confirm change password',
          content: 'Are you sure you want to update your profile ?',
          onOk: async () => {
            try {
              // Update user data on server using API call
              const response = await fetch('/api/update-profile', {
                method: 'POST',
                body: JSON.stringify(info), // Send updated info in the request body
              });
      
              if (response.ok) {
                const updatedUser = await response.json(); // Parse updated user data
                setInfo(updatedUser); // Update local state with updated information
                navigate('/profile'); // Navigate back to profile page with updated data
              } else {
                // Handle API call errors (e.g., display error message)
                console.log("Error")
              }
            } catch (error) {
              console.error('Error updating profile:', error);
              // Handle errors during API call
            }
          },
          footer: (_, { OkBtn, CancelBtn }) => (
            <>
              <CancelBtn />
              <OkBtn />
            </>
          ),
        });
      };
  return (
    <Layout style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.bg}>
        <div className={styles.header}>Edit profile</div>
      <Content style={{ width: 800, maxHeight: 'fit-content'}}>
    <Form
        {...formItemLayout} 
        style={{maxWidth: 800, padding: '10px'}}
    >
      <Form.Item
        label="ID"
        name="ID"
        rules={[
          {
            required: true,
            message: 'Please input!',
          },
        ]}
      >
        <Input defaultValue={info.id} onChange={handleChange} disabled/>
      </Form.Item>

      <Form.Item
        label="First Name"
        name="First Name"
        rules={[
          {
            required: true,
            message: 'Please input!',
          },
        ]}
      >
        <Input defaultValue={info.fullName} onChange={handleChange}/>
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="Last Name"
        rules={[
          {
            required: true,
            message: 'Please input!',
          },
        ]}
      >
        <Input defaultValue={info.userName}  onChange={handleChange}/>
      </Form.Item>
      <Form.Item
        label="Role"
        name="Role"
        rules={[
          {
            required: true,
            message: 'Please input!',
          },
        ]}
      >
        <Select defaultValue={info.role} onChange={handleChange}>
          <Select.Option value="Admin"/>
          <Select.Option value="Staff"/>
        </Select>
        
      </Form.Item>

      <Form.Item
        label="Email"
        name="Email"
        rules={[
          {
            required: true,
            message: 'Please input!',
          },
        ]}
      >
        <Input defaultValue={info.email}  onChange={handleChange}/>
      </Form.Item>

      <Form.Item
        label="Phone number"
        name="Phone number"
        rules={[
          {
            required: true,
            message: 'Please input!',
          },
        ]}
      >
        <Input defaultValue={info.phone}  onChange={handleChange}/>
      </Form.Item>
      

      <Form.Item
        wrapperCol={{
          offset: 6,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" onClick={editProfile}>
          Update profile
        </Button>
      </Form.Item>
    </Form>
    </Content>
    </div>
    </Layout>
  );
};
export default EditProfile;