import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getBranchesData,
    getBranch,
    createBranch,
    deleteBranch,
    updateBranch,
    editBranch
} from "../api/branches.api"; // api faylingiz manzili

// Barcha filiallar ro'yxatini olish
export const useBranchesData = () => {
    return useQuery({
        queryKey: ["branches", "list"],
        queryFn: getBranchesData,
        initialData: []
    });
}

// Bitta filial ma'lumotini ID bo'yicha olish
export const useBranchData = (id) => {
    return useQuery({
        queryKey: ["branches", "detail", id],
        queryFn: () => getBranch(id),
        enabled: !!id // Faqat ID mavjud bo'lganda ishlaydi
    });
}

// Yangi filial qo'shish
export const useCreateBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBranch,
        onSuccess: () => {
            // Ro'yxatni yangilash
            queryClient.invalidateQueries(["branches", "list"]);
        },
    });
}

// Filialni to'liq yangilash (PUT)
export const useUpdateBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBranch,
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries(["branches", "list"]);
            queryClient.invalidateQueries(["branches", "detail", id]);
        },
    });
}

// Filialni qisman tahrirlash (PATCH)
export const useEditBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editBranch,
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries(["branches", "list"]);
            queryClient.invalidateQueries(["branches", "detail", id]);
        },
    });
}

// Filialni o'chirish
export const useDeleteBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBranch,
        onSuccess: () => {
            queryClient.invalidateQueries(["branches", "list"]);
        },
    });
}