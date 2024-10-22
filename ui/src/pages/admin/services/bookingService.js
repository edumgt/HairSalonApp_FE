import BASE_URL from "../../../api"

export const getAll = async () => {
    const response = await BASE_URL.get('booking')
    return response
}
export const update = async (values) => {
    const response = await BASE_URL.put(`booking/${values.bookingId}`, {
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
