import api from "./axios";

export const getTeachersData = () =>
     api.get("/teachers/").then(res => res.data.data);

export const getTeachersDataFullInfo = () =>
     api.get("/teachers/?full_info=true").then(res => res.data.data);

export const getTeacher = (id) =>
     api.get(`/teachers/${id}/`).then(res => res.data.data) 

export const createTeacher = (data) =>
     api.post("/teachers/", data).then(res => res.data.data);

export const deleteTeacher = (id) =>
     api.delete(`/teachers/${id}/`).then(res => res.data.data);

export const updateTeacher = ({ id, data }) =>
     api.put(`/teachers/${id}/`, data).then(res => res.data.data);

export const editTeacher = ({id, data}) =>
     api.patch(`/teachers/${id}/`, data).then(res => res.data.data)

export const getAvailabilityTeacher = () => 
     api.post(`/teachers/availability/`).then(res => res.data.data)