import { useState } from "react"
import styles from './changePassword.module.css'
import { useNavigate } from "react-router-dom"
import { Button,Form,Input,Layout,Modal } from 'antd';
import { Content } from "antd/es/layout/layout";

const ChangePassword = () => {
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
    const navigate = useNavigate()
    const [inputs, setInputs] = useState({})
    const [error, setError] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
        setError('')
    }
    const handleSubmit = () => {
        if(!inputs.password || !inputs.newPassword || !inputs.confirmPassword){
            setError('All fields must not be blank.')
            return;
        }
        if(inputs.newPassword !== inputs.confirmPassword){
            setError('New passwords do not match.')
            return;
        }
        if(inputs.password === inputs.newPassword){
            setError('New password do not match with current password.')
            return;
        }
        Modal.confirm({
            title: 'Confirm change password',
            content: 'Are you sure you want to change your password ?',
            onOk: () => navigate('/profile'),
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                <CancelBtn />
                <OkBtn />
                </>
            ),
            });
            console.log(inputs)
    }
    
  return (
    <Layout style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.bg}>
        <div className={styles.header}>Change password</div>
        <Content style={{ width: 800, maxHeight: 'fit-content'}}>
        <Form
        {...formItemLayout} 
        style={{maxWidth: 800, padding: '10px'}}
        >
            <Form.Item
                label="Current password"
                name="password"
                rules={[
                {
                    required: true,
                    message: 'Please input!',
                },
                ]}
            >
                <Input.Password
                    name="password"
                    value={inputs.password}
                    onChange={handleChange}
                    visibilityToggle={{
                        visible: passwordVisible,
                        onVisibleChange: setPasswordVisible,
                    }}
                />
            </Form.Item>
            <Form.Item
                label="New password"
                name="newPassword"
                rules={[
                {
                    required: true,
                    message: 'Please input!',
                },
                ]}
            >
                <Input.Password
                    name="newPassword"
                    value={inputs.newPassword}
                    onChange={handleChange}
                    visibilityToggle={{
                        visible: newPasswordVisible,
                        onVisibleChange: setNewPasswordVisible,
                    }}
                />
            </Form.Item>
            <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                {
                    required: true,
                    message: 'Please input!',
                },
                ]}
            >
                <Input.Password
                    name="confirmPassword"
                    value={inputs.confirmPassword}
                    onChange={handleChange}
                    visibilityToggle={{
                        visible: confirmPasswordVisible,
                        onVisibleChange: setConfirmPasswordVisible,
                    }}
                />
            </Form.Item>
            {error && <div className="error">*{error}</div>}
            <Form.Item
                wrapperCol={{
                offset: 6,
                span: 16,
                }}
            >
                <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                    Save
                </Button>
            </Form.Item>
        </Form>
        </Content>
        </div>
        </Layout>
  )
}

export default ChangePassword