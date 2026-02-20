import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudentDiscount, createStudentTransactions, getDebtorsStudents, getStats, getStudentDiscounts, getStudentTransactions, uptadeStudentDiscount } from "../api/billing.api";

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

export const useStudentTransactions = (id) => {
    return useQuery({
        queryKey: ["student-transactions", id],
        queryFn: () => getStudentTransactions(id),
    });
};

export const useCreateStudentTransaction = (id) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createStudentTransactions(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["student-transactions", id],
            });
            queryClient.invalidateQueries({
                queryKey: ["student", id],
            });
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
            queryClient.invalidateQueries({
                queryKey: ["student-discounts", id],
            });
            queryClient.invalidateQueries({
                queryKey: ["student", id],
            });
        },
    });
};

export const useUpdateStudentDiscount = (studentId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ discountId, data }) => uptadeStudentDiscount(discountId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["student-discounts", studentId],
            });
            queryClient.invalidateQueries({
                queryKey: ["student", studentId],
            });
        },
    });
};
