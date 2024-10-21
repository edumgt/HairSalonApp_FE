import BASE_URL from "../../../api/index"

export const getAll = async () => {
    const response = await BASE_URL.get('slot')
    return response
}
export const create = async (value) => {
    const response = await BASE_URL.post('slot', {
        timeStart: value.timeStart.format('HH:mm')
    })
    return response
}
export const update = async (value) => {
    const response = await BASE_URL.put(`slot/${value.id}`, {
        timeStart: value.timeStart.format('HH:mm'),
    })
    return response
}
export const deleteById = async (id) => {
    const response = await BASE_URL.delete(`slot/${id}`)
    return response
}