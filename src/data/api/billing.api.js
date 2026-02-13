import api from "./axios";

export const getStats = () =>
    api.get(`/billings/stats/`).then(res => res.data.data)

export const getDebtorsStudents = () =>
    api.get(`/billings/students/debtors/`).then(res => res.data.data)

export const getStudentTransactions = (id) =>
    api.get(`/billings/students/${id}/transactions/`).then(res => res.data.data)

export const createStudentTransactions = (id, data) =>
    api.post(`/billings/students/${id}/transactions/`, data).then(res => res.data.data)