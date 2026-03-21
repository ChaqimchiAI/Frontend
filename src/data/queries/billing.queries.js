import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios"; // Axios instance ni import qilishni unutmang
import { 
    createStudentDiscount, 
    createStudentTransactions, 
    getDebtorsStudents, 
    getStats, 
    getStudentDiscounts, 
    getStudentTransactions, 
    uptadeStudentDiscount, 
    withdrawStudentTransaction 
} from "../api/billing.api";

export const useBillingStats = () => {
    return useQuery({
        queryKey: ["billing-stats"],
        queryFn: getStats,
    });
};

export const useDebtorsStudents = ({ page, ordering } = {}) => {
    return useQuery({
        queryKey: ["debtors-students", page, ordering],
        queryFn: () => getDebtorsStudents({ page, ordering }),
    });
};

// Bu query "payment.queries.js" bilan bir xil, lekin bu yerda ham turishi mumkin
export const useStudentTransactions = (id, filters) => {
    return useQuery({
        queryKey: ["student-transactions", id, filters],
        queryFn: () => getStudentTransactions(id, filters),
    });
};

export const useCreateStudentTransaction = (id) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createStudentTransactions(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["student-transactions", id] });
            queryClient.invalidateQueries({ queryKey: ["student", id] });
            queryClient.invalidateQueries({ queryKey: ["billing-stats"] });
        },
    });
};

export const useStudentDiscounts = (id) => {
    return useQuery({
        queryKey: ["student-discounts", id],
        queryFn: () => getStudentDiscounts(id),
    });
};

export const useCreateStudentDiscount = (id) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createStudentDiscount(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["student-discounts", id] });
            queryClient.invalidateQueries({ queryKey: ["student", id] });
        },
    });
};

export const useUpdateStudentDiscount = (studentId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ discountId, data }) => uptadeStudentDiscount(discountId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["student-discounts", studentId] });
        },
    });
};

export const useWithdrawStudentTransaction = (id) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => withdrawStudentTransaction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["student-transactions", id] });
            queryClient.invalidateQueries({ queryKey: ["student", id] });
            queryClient.invalidateQueries({ queryKey: ["billing-stats"] });
        },
    });
};


// --- YANGI VOID HOOK ---
export const useVoidTransaction = (studentId) => {
    const queryClient = useQueryClient();
    return useMutation({
        // Bu yerda bitta obyekt qabul qilamiz va ichidan kerakli maydonlarni ajratamiz
        mutationFn: async ({ transactionId, reason }) => {
            // Endi URL-ga obyekt emas, aniq ID boradi
            const response = await api.post(`/billings/transactions/${transactionId}/void/`, {
                reason: reason || "Sabab ko'rsatilmadi"
            });
            return response.data;
        },
        onSuccess: () => {
            // Ma'lumotlarni yangilash
            queryClient.invalidateQueries({ queryKey: ["student-transactions", studentId] });
            queryClient.invalidateQueries({ queryKey: ["student", studentId] });
            queryClient.invalidateQueries({ queryKey: ["billing-stats"] });
        },
    });
};