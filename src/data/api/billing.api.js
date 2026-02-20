import api from "./axios";

export const getStats = () =>
    api.get(`/billings/stats/`).then(res => res.data.data)

export const getDebtorsStudents = (params) =>
    api.get(`/billings/students/debtors/`, { params }).then(res => res.data.data)

export const getStudentTransactions = (id) =>
    api.get(`/billings/students/${id}/transactions/`).then(res => res.data.data)

export const createStudentTransactions = (id, data) =>
    api.post(`/billings/students/${id}/transactions/`, data).then(res => res.data.data)

export const getStudentDiscounts = (id) =>
    api.get(`/billings/students/${id}/discounts/`).then(res => res.data.data)

export const createStudentDiscount = (id, data) =>
    api.post(`/billings/students/${id}/discounts/`, data).then(res => res.data.data)

export const uptadeStudentDiscount = (discountId, data) =>
    api.patch(`/billings/discounts/${discountId}/`, data).then(res => res.data.data)