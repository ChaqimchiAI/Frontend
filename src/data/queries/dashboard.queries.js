import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const res = await api.get("core/dashboard/stats/monthly/");
            return res.data.data;
        },
    });
};