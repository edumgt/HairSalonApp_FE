import BASE_URL from "../../../api"

export const getAll = async () => {
    const response = await BASE_URL.get('manager')
    return response
}