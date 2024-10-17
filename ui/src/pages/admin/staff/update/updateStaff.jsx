import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AddForm from "../../../../layouts/admin/components/form/add/addForm"
import NavLink from "../../../../layouts/admin/components/link/navLink"

function UpdateStaff() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState('');
    const [staffData, setStaffData] = useState(null);

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/staff/${id}`);
                if (response.data && response.data.code === 200) {
                    setStaffData(response.data.result);
                } else {
                    throw new Error('Lấy dữ liệu thất bại');
                }
            } catch (error) {
                console.error('Error fetching staff data:', error);
                setError('Lấy dữ liệu nhân viên thất bại. Vui lòng thử lại');
            }
        };

        fetchStaffData();
    }, [id]);

    const inputs = [
        // ... (same as in addStaff.jsx)
    ];

    const handleSubmit = async (values) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/staff/${id}`, values);
            if (response.data && response.data.code === 200) {
                navigate('/staff');
            } else {
                setError('Cập nhật nhân viên thất bại. Vui lòng thử lại');
            }
        } catch (error) {
            console.error('Lỗi cập nhật nhân viên:', error);
            setError('Có lỗi xảy ra khi cập nhật nhân viên. Vui lòng thử lại.');
        }
    };

    if (!staffData) return <div>Đang tải...</div>;

    return (
        <>
            <NavLink currentPage='Staff' hasChild={true} nextPage='Update staff' />
            {error && <div style={{color: 'red'}}>{error}</div>}
            <AddForm inputs={inputs} onSubmit={handleSubmit} initialValues={staffData} />
        </>
    );
}

export default UpdateStaff;
