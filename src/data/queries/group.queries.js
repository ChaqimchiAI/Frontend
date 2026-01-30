import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGroupsData,
  getGroup,
  createGroup,
  updateGroup,
  editGroup,
  deleteGroup,
  getGroupSchedule,
  getGroupScheduleById,
  createGroupSchedule,
  editGroupSchedule,
  deleteGroupSchedule
} from "../api/groups.api";

// ================= GROUPS =================

// LIST
export const useGroups = () =>
  useQuery({
    queryKey: ["groups", "list"],
    queryFn: getGroupsData,
    initialData: []
  });

// DETAIL
export const useGroup = (id) =>
  useQuery({
    queryKey: ["groups", "detail", id],
    queryFn: () => getGroup(id),
    enabled: !!id,
    initialData: null
  });

// CREATE
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["groups", "list"]);
    }
  });
};

// UPDATE (PUT)
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGroup,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["groups", "list"]);
      queryClient.invalidateQueries(["groups", "detail", id]);
    }
  });
};

// EDIT (PATCH)
export const useEditGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editGroup,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["groups", "list"]);
      queryClient.invalidateQueries(["groups", "detail", id]);
    }
  });
};

// DELETE
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["groups", "list"]);
    }
  });
};

// ================= SCHEDULE =================

// LIST
export const useGroupSchedule = (id) =>
  useQuery({
    queryKey: ["groups", "schedule", id],
    queryFn: () => getGroupSchedule(id),
    enabled: !!id,
    initialData: []
  });

// DETAIL
export const useGroupScheduleById = ({ id, scheduleId }) =>
  useQuery({
    queryKey: ["groups", "schedule", id, scheduleId],
    queryFn: () => getGroupScheduleById({ id, scheduleId }),
    enabled: !!id && !!scheduleId,
    initialData: null
  });

// CREATE
export const useCreateGroupSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroupSchedule,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["groups", "schedule", id]);
    }
  });
};

// EDIT
export const useEditGroupSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editGroupSchedule,
    onSuccess: (_, { id, scheduleId }) => {
      queryClient.invalidateQueries(["groups", "schedule", id]);
      queryClient.invalidateQueries([
        "groups",
        "schedule",
        id,
        scheduleId
      ]);
    }
  });
};

// DELETE
export const useDeleteGroupSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroupSchedule,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["groups", "schedule", id]);
    }
  });
};
