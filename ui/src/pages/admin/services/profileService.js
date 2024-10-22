import BASE_URL from "../../../api/index"

const token = localStorage.getItem('token')
export const getProfile = async () => {
    const response = await BASE_URL.get('profile/', {
        headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
    })
    return response
}
export const update = async (values) => {
    const response = await BASE_URL.put('profile/', {
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role,
        email: values.email,
        phone: values.phone
    },
    {
        headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
    })
    return response
}
export const changePassword = async (values) => {
    const response = await BASE_URL.post('auth/password/change', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}
