import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeadsData,
  getLeadsStats,
  getLeadHistory,
  createLead,
  updateLead,
  deleteLead
} from "../api/leads.api";



// LIST
export const useLeads = () =>
  useQuery({
    queryKey: ["leads", "list"],
    queryFn: getLeadsData,
    initialData: []
  });



// DETAIL
export const useLead = (id) =>
  useQuery({
    queryKey: ["leads", "detail", id],
    queryFn: () => getLead(id),
    enabled: !!id,
    initialData: []
  });



// STATS
export const useLeadsStats = () =>
  useQuery({
    queryKey: ["leads", "stats"],
    queryFn: getLeadsStats,
    initialData: []
  });



// HISTORY
export const useLeadHistory = (id) =>
  useQuery({
    queryKey: ["leads", "history", id],
    queryFn: () => getLeadHistory(id),
    enabled: !!id,
    initialData: []
  });



// CREATE
export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries(["leads", "list"]);
      queryClient.invalidateQueries(["leads", "stats"]);
    },
  });
};



// UPDATE
export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLead,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["leads", "list"]);
      queryClient.invalidateQueries(["leads", "detail", id]);
    },
  });
};



// DELETE
export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries(["leads", "list"]);
      queryClient.invalidateQueries(["leads", "stats"]);
    },
  });
};
