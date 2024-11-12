import BASE_URL from "../../../api/index"

export const getAll = async () => {
    const response = await BASE_URL.get('salon')
    return response
}
export const create = async (value) => {
    const response = await BASE_URL.post('salon', {
        name: value.name,
        address: value.address,
        district: value.district,
        hotline: value.hotline,
        image: value.image
    })
    return response
}
export const update = async (value) => {
    const response = await BASE_URL.put(`salon/${value.id}`, {
        name: value.name,
        address: value.address,
        district: value.district,
        hotline: value.hotline,
        image: value.image
    })
    return response
}
export const switchStatus = async (id) => {
    const response = await BASE_URL.put(`salon/${id}/status`)
    return response
}

