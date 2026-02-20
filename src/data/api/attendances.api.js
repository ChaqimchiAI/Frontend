import api from "./axios";

export const getAttendances = (id) =>
    api.get(`/attendances/?group=${id}`).then(res => res.data.data)

export const getStudentAttendances = (student_id, month, year) =>
    api.get(`/attendances/student/${student_id}/`, {
        params: { month, year }
    }).then(res => res.data.data)

export const getGroupAttendances = (schedule_id, date) =>
    api.get(`/attendances/schedule/${schedule_id}/?date=${date}`).then(res => res.data.data)

export const createAttendance = (id, data) =>
    api.patch(`/attendances/${id}/`, data).then(res => res.data.data)