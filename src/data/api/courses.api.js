import api from "./axios";

export const getCoursesData = () =>
     api.get("/courses/").then(res => res.data.data)

export const getCourse = (id) =>
     api.get(`/courses/${id}/`).then(res => res.data.data) 

export const createCourse = (data) =>
     api.post("/courses/", data).then(res => res.data.data)

export const deleteCourse = (id) =>
     api.delete(`/courses/${id}/`).then(res => res.data.data)

export const updateCourse = ({ id, data }) =>
     api.put(`/courses/${id}/`, data).then(res => res.data.data)

export const editCourse = ({id, data}) =>
     api.patch(`/courses/${id}/`, data).then(res => res.data.data)