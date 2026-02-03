import api from "./axios";

// Barcha filiallar ro'yxatini olish
export const getBranchesData = () =>
     api.get("/branches/").then(res => res.data.data);

// Id bo'yicha bitta filialni olish
export const getBranch = (id) =>
     api.get(`/branches/${id}/`).then(res => res.data.data);

// Yangi filial qo'shish (POST)
export const createBranch = (data) =>
     api.post("/branches/", data).then(res => res.data.data);

// Filialni o'chirish (DELETE)
export const deleteBranch = (id) =>
     api.delete(`/branches/${id}/`).then(res => res.data.data);

// Filial ma'lumotlarini to'liq yangilash (PUT)
export const updateBranch = ({ id, data }) =>
     api.put(`/branches/${id}/`, data).then(res => res.data.data);

// Filial ma'lumotlarini qisman tahrirlash (PATCH)
export const editBranch = ({ id, data }) =>
     api.patch(`/branches/${id}/`, data).then(res => res.data.data);