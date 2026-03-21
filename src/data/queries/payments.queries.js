import { useQuery } from "@tanstack/react-query";
import api from "../api/axios"; 

export const useStudentTransactions = (studentId, filters) => {
  return useQuery({
    queryKey: ["student-transactions", studentId, filters], // queryKey nomi billing bilan bir xil bo'lishi shart
    queryFn: async () => {
      const response = await api.get(`/billings/students/${studentId}/transactions/`, {
        params: filters,
      });
      // Backend formatiga ko'ra response.data.data ni qaytaramiz
      return response.data.data; 
    },
    enabled: !!studentId,
  });
};