import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeadsData,
  getLeadsStats,
  getLeadHistory,
  createLead,
  updateLead,
  deleteLead,
  getLead,
  createLeadHistory
} from "../api/leads.api";



// LIST
export const useLeads = (filters) =>
  useQuery({
    queryKey: ["leads", "list", filters],
    queryFn: () => getLeadsData(filters),
    initialData: { results: [], count: 0 }
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
export const useLeadsStats = (filters) =>
  useQuery({
    queryKey: ["leads", "stats", filters],
    queryFn: () => getLeadsStats(filters),
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

// CREATE History 
export const useCreateLeadHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLeadHistory,
    onSuccess: () => {
      queryClient.invalidateQueries(["leads", "history"]);
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
