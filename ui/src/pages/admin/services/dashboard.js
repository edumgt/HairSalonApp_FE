import BASE_URL from "../../../api"

export const getDashboardByAdmin = async () => {
    const response = await BASE_URL.get('dashboard/admin')
    return response
}
export const getDashboardByManager = async () => {
    const response = await BASE_URL.get('dashboard/manager')
    return response
}

export const getManagerBooking = async () => {
    try {
        const response = await BASE_URL.get('/booking/manager');
        return response.data;
    } catch (error) {
        throw error;
    }
};
