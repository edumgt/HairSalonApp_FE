import BASE_URL from "../../../api/index"

export const getAll = async () => {
    const response = await BASE_URL.get('salon')
    return response
}
export const create = async (value) => {
    const response = await BASE_URL.post('salon', {
        address: value.address,
        district: value.district
    })
    return response
}
export const update = async (value) => {
    const response = await BASE_URL.put('salon', {
        id: value.id,
        open: value.open,
        address: value.address,
        district: value.district
    })
    return response
}
export const deleteById = async (id) => {
    const response = await BASE_URL.delete(`salon/${id}`)
    return response
}
