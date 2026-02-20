import api from "./axios";

// ================= GROUPS =================

// LIST
export const getGroupsData = () =>
    api.get("/groups/").then(res => res.data.data);

// DETAIL
export const getGroup = (id) =>
    api.get(`/groups/${id}/`).then(res => res.data.data);

// CREATE
export const createGroup = (data) =>
    api.post("/groups/", data).then(res => res.data.data);

// DELETE
export const deleteGroup = (id) =>
    api.delete(`/groups/${id}/`).then(res => res.data.data);

// UPDATE (PUT)
export const updateGroup = ({ id, data }) =>
    api.put(`/groups/${id}/`, data).then(res => res.data.data);

// EDIT (PATCH)
export const editGroup = ({ id, data }) =>
    api.patch(`/groups/${id}/`, data).then(res => res.data.data);

// ================= SCHEDULE =================

// LIST
export const getGroupSchedule = (id) =>
    api.get(`/groups/${id}/schedules/`).then(res => res.data.data);

// CREATE
export const createGroupSchedule = ({ id, data }) =>
    api.post(`/groups/${id}/schedules/`, data).then(res => res.data.data);

// DETAIL
export const getGroupScheduleById = ({ id, scheduleId }) =>
    api.get(`/groups/${id}/schedules/${scheduleId}/`)
        .then(res => res.data.data);

// UPDATE
export const editGroupSchedule = ({ id, scheduleId, data }) =>
    api.patch(`/groups/${id}/schedules/${scheduleId}/`, data)
        .then(res => res.data.data);

// DELETE
export const deleteGroupSchedule = ({ id, scheduleId }) =>
    api.delete(`/groups/${id}/schedules/${scheduleId}/`)
        .then(res => res.data.data);

// Get celected groups students
export const getGroupStudents = (id) =>
    api.get(`/groups/${id}/students/`).then(res => res.data.data);

// Add a student to a group
export const addStudentToGroup = ({ id, student_id }) =>
    api.post(`/groups/${id}/students/`, { student_id: student_id }).then(res => res.data.data);

// leadslardagini guruhga qoshish
export const addLeadToGroup = ({ id, group_id }) =>
    api.post(`/groups/leads/add/`, { lead_id: id, group_id }).then(res => res.data.data);

export const groupStudentStatusChange = ({ student_id, group_id, status }) =>
    api.patch(`/groups/${group_id}/students/${student_id}/`, { status }).then(res => res.data.data);