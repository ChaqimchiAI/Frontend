import api from "./axios"

export const getStudents = () => 
    api.get("/students/").then(res => res.data.data)

export const getStudent = (id) => 
    api.get(`/students/${id}`).then(res => res.data.data)

export const createStudent = (data) => 
    api.post("/students/", data).then(res => res.data.data)

export const updateStudent = ({ id, data }) => 
    api.patch(`/students/${id}`, data).then(res => res.data.data)

export const deleteStudent = (id) => 
    api.delete(`/students/${id}`).then(res => res.data.data)

export const getStudentNotes = (id) => 
    api.get(`/students/${id}/notes/`).then(res => res.data.data)

export const createStudentNote = ({id, data}) => 
    api.post(`/students/${id}/notes/`, data).then(res => res.data.data)

// export const updateStudentNote = ({id, data}) => 
//     api.patch(`/students/${id}/notes/`, data).then(res => res.data.data)

// export const deleteStudentNote = ({id, data}) => 
//     api.delete(`/students/${id}/notes/`, data).then(res => res.data.data)