import BASE_URL from "../../../api"

export const getAll = async () => {
    const response = await BASE_URL.get('combo')
    return response
}
export const create = async (values) => {
    const response = await BASE_URL.post('combo', {
        name: values.name,
        price: values.price,
        description: values.description,
        listServiceId: values.services,
    })
    return response
}
export const update = async (values) => {
    const response = await BASE_URL.put(`combo/${values.id}`, {
        name: values.name,
        price: values.price,
        description: values.description,
        listServiceId: values.services,
    })
    return response
}
export const searchById = async (id) => {
    const response = await BASE_URL.get(`combo/${id}`)
    return response
}
export const deleteById = async (id) => {
    const response = await BASE_URL.delete(`combo/${id}`)
    return response
}
export const getServices = async () => {
    const response = await BASE_URL.get('service')
    return response
}
