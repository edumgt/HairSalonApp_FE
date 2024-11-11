import BASE_URL from "../../../api"

export const getDashboardByAdmin = async () => {
    const response = await BASE_URL.get('dashboard/admin')
    return response
}
export const getDashboardByManager = async () => {
    const response = await BASE_URL.get('dashboard/manager')
    return response
}