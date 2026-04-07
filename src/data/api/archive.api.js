import api from "./axios";

// ═══════════════════════════════════════════════════════
//  GURUHLAR
// ═══════════════════════════════════════════════════════

// Ro'yxat (finished + paused guruhlar)
export const getArchiveGroups = (params) =>
    api.get("/archives/groups/", { params }).then(res => res.data.data);

// Detail
export const getArchiveGroup = (id) =>
    api.get(`/archives/groups/${id}/`).then(res => res.data.data);

// Status o'zgartirish (PATCH)
export const patchArchiveGroupStatus = ({ id, status }) =>
    api.patch(`/archives/groups/${id}/`, { status }).then(res => res.data.data);

// Guruh o'quvchilari
export const getArchiveGroupStudents = (id) =>
    api.get(`/archives/groups/${id}/students/`).then(res => res.data.data);

// Guruhga o'quvchi qo'shish
export const addStudentToArchiveGroup = ({ id, student_id, comment }) =>
    api.post(`/archives/groups/${id}/students/`, { student_id, comment }).then(res => res.data.data);

// ═══════════════════════════════════════════════════════
//  O'QUVCHILAR
// ═══════════════════════════════════════════════════════

// Ro'yxat
export const getArchiveStudents = (params) =>
    api.get("/archives/students/", { params }).then(res => res.data.data);

// Detail
export const getArchiveStudent = (id) =>
    api.get(`/archives/students/${id}/`).then(res => res.data.data);

// Guruh tarixi
export const getArchiveStudentEnrollmentHistory = (id) =>
    api.get(`/archives/students/${id}/enrollment-history/`).then(res => res.data.data);

// ═══════════════════════════════════════════════════════
//  LIDLAR
// ═══════════════════════════════════════════════════════

// Ro'yxat
export const getArchiveLeads = (params) =>
    api.get("/archives/leads/", { params }).then(res => res.data.data);

// Detail
export const getArchiveLead = (id) =>
    api.get(`/archives/leads/${id}/`).then(res => res.data.data);
