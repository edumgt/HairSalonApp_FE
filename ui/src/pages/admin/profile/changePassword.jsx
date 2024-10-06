import { useState } from "react"
import './changePassword.css'
import { useNavigate } from "react-router-dom"
import { Button, Modal, Space } from 'antd';

const ChangePassword = () => {
    const navigate = useNavigate()
    const [inputs, setInputs] = useState({})
    const [error, setError] = useState('')
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
        setError('')
    }
    const handleSubmit = () => {
        // event.preventDefault();
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
    <div className="frame">
            <div className="header">Change Password</div>
            <form onSubmit={handleSubmit}>
            <div className="inputContainer">
                <div className="inputGroup">
                    <div className="label">
                        <label >Current password</label>
                    </div>
                    <div className="input">
                        <input type="password" name="password" value={inputs.password}
                            onChange={handleChange}/>
                    </div>
                </div>
                <div className="inputGroup">
                    <div className="label">
                        <label >New password</label>
                    </div>
                    <div className="input">
                        <input type="password" name="newPassword" value={inputs.newPassword}
                            onChange={handleChange}/>
                    </div>
                </div>
                <div className="inputGroup">
                    <div className="label">
                        <label >Confirm new password</label>
                    </div>
                    <div className="input">
                        <input type="password" name="confirmPassword" value={inputs.confirmPassword}
                            onChange={handleChange}/>
                    </div>
                </div>
                {error && <div className="error">*{error}</div>}
            </div>
            <div className="change">
                <Space>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        >
                        Change Password
                    </Button>
                </Space>
                </div>
            </form>
                    
    </div>
  )
}

export default ChangePassword