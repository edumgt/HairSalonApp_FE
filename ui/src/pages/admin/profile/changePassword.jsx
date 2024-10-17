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
            setError('Các ô nhập không được bỏ trống')
            return;
        }
        if(inputs.newPassword !== inputs.confirmPassword){
            setError('Mật khẩu mới không khớp')
            return;
        }
        if(inputs.password === inputs.newPassword){
            setError('Mật khẩu mới không được trùng với mật khẩu hiện tại')
            return;
        }
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có muốn thay đổi mật khẩu ?',
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
        <div className={styles.header}>Đổi mật khẩu</div>
        <Content style={{ width: 800, maxHeight: 'fit-content'}}>
        <Form
        {...formItemLayout} 
        style={{maxWidth: 800, padding: '10px'}}
        >
            <Form.Item
                label="Mật khẩu hiện tại"
                name="password"
                rules={[
                {
                    required: true,
                    message: 'Vui lòng nhập',
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
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                {
                    required: true,
                    message: 'Vui lòng nhập',
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
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                rules={[
                {
                    required: true,
                    message: 'Vui lòng nhập',
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
                    Lưu
                </Button>
            </Form.Item>
        </Form>
        </Content>
        </div>
        </Layout>
  )
}

export default ChangePassword