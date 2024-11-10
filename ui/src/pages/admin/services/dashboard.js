import BASE_URL from "../../../api"

export const getDashboard = async () => {
    const response = await BASE_URL.get('dashboard/admin')
    return response
}