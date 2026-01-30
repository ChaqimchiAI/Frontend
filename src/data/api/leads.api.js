import api from "./axios";

export const getLeadsData = (params) =>
     api.get("/leads/", { params }).then(res => res.data.data)

export const getLead = (id) =>
     api.get(`/leads/${id}`).then(res => res.data.data)

export const getLeadsStats = (params) =>
     api.get("/leads/stats/", { params }).then(res => res.data.data)

export const createLead = (data) =>
     api.post("/leads/", data).then(res => res.data.data)

export const deleteLead = (id) =>
     api.delete(`/leads/${id}/`).then(res => res.data.data)

export const updateLead = ({ id, data }) =>
     api.patch(`/leads/${id}/`, data).then(res => res.data.data)

export const getLeadHistory = (id) =>
     api.get(`/leads/${id}/histories/`).then(res => res.data.data.results || res.data.data)

export const createLeadHistory = ({ id, data }) =>
     api.post(`/leads/${id}/histories/`, data).then(res => res.data.data)