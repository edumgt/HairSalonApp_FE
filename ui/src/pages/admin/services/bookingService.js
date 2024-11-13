import BASE_URL from "../../../api"

export const getAll = async () => {
    const response = await BASE_URL.get('booking')
    return response
}
export const getAllByManager = async () => {
    const response = await BASE_URL.get('booking/manager')
    return response
}
export const getAllByStylist = async () => {
    const response = await BASE_URL.get('booking/stylist')
    return response
}
export const update = async (values) => {
    const response = await BASE_URL.put('booking', {
        bookingId: values.bookingId,
        date: values.date,
        slotId: values.slotId,
    })
    return response
}
export const updateStatus = async (values) => {
    const response = await BASE_URL.put(`booking/${values.bookingId}/${values.status}`);
    return response;
}
export const deleteById = async (id) => {
    const response = await BASE_URL.delete(`booking/${id}`);
    return response;
}