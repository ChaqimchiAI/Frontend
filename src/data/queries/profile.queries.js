import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, changePassword } from "../api/profile.api";

export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationKey: ["change-password"],
        mutationFn: changePassword,
    });
};
