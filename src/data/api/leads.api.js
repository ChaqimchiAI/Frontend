import api from "./axios";

export const getLeadsData = () =>
     api.get("/leads/").then(res => res.data.data)

export const getLead = (id) => 
     api.get(`/leads/${id}`).then(res => res.data.data) 

export const getLeadsStats = () => 
     api.get("/leads/stats/").then(res => res.data.data)

export const createLead = (data) =>
     api.post("/leads/", data).then(res => res.data.data)

export const deleteLead = (id) =>
     api.delete(`/leads/${id}/`).then(res => res.data.data)

export const updateLead = ({ id, data }) =>
     api.put(`/leads/${id}/`, data).then(res => res.data.data)

export const getLeadHistory = (id) =>
     api.get(`/leads/${id}/histories/`).then(res => res.data.data)

export const createLeadHistory = ({id, data}) => 
     api.post(`/leads/${id}/histories/`, data).then(res => res.data.data)