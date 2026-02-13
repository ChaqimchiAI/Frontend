import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudentTransactions, getDebtorsStudents, getStats, getStudentTransactions } from "../api/billing.api";

export const useBillingStats = () => {
    return useQuery({
        queryKey: ["billing-stats"],
        queryFn: getStats,
    });
};

export const useDebtorsStudents = () => {
    return useQuery({
        queryKey: ["debtors-students"],
        queryFn: getDebtorsStudents,
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
