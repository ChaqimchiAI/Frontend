import api from "./axios";

export const getRoomsData = () =>
     api.get("/core/rooms/").then(res => res.data.data)

export const getRoom = (id) =>
     api.get(`/core/rooms/${id}`).then(res => res.data.data)

export const createRoom = (data) =>
     api.post("/core/rooms/", data).then(res => res.data.data)

export const deleteRoom = (id) =>
     api.delete(`/core/rooms/${id}/`).then(res => res.data.data)

export const updateRoom = ({ id, data }) =>
     api.patch(`/core/rooms/${id}/`, data).then(res => res.data.data)

export const editRoom = ({ id, data }) =>
     api.patch(`/core/rooms/${id}/`, data).then(res => res.data.data)