import api from "./axios"

export const getProfile = () => 
    api.get("/auth/profile/").then(res => res.data.data)

export const changePassword = (data) => 
    api.post("/auth/change-password/", data)