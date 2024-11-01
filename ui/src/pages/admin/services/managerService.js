import BASE_URL from "../../../api"

export const getAll = async () => {
    const response = await BASE_URL.get('manager')
    return response
}
export const update = async (values) => {
    const response = await BASE_URL.put(`manager/${values.id}`, {
        salonId: values.salonId,
    })
    return response
}
export const demoteById = async (id) => {
    const response = await BASE_URL.delete(`manager/delete/${id}`)
    return response
}