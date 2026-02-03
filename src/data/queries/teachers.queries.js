import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
     createTeacher,
     deleteTeacher,
     editTeacher,
     getAvailabilityTeacher,
     getTeacher,
     getTeachersData,
     getTeachersDataFullInfo,
     updateTeacher
} from "../api/teacher.api";

// GET all teacher
export const useTeachersData = () => {
     return useQuery({
          queryKey: ["teachers"],
          queryFn: getTeachersData,
          initialData: [],
     });
};

// GET all teacher with full info
export const useTeachersDataFullInfo = () => {
     return useQuery({
          queryKey: ["teachers-full-info"],
          queryFn: getTeachersDataFullInfo,
          initialData: [],
     });
};

// GET teacher
export const useTeacher = () => {
     return useQuery({
          queryKey: ["teachers"],
          queryFn: getTeacher,
          initialData: [],
     });
};

// CREATE new teacher
export const useCreateTeacher = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationFn: createTeacher,
          onSuccess: () => {
               queryClient.invalidateQueries(["teachers"]);  // cache yangilanadi
          },
     });
};

// UPDATE existing teacher
export const useUpdateTeacher = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationFn: updateTeacher,
          onSuccess: () => queryClient.invalidateQueries(["teachers"]),
     });
};

// DELETE teacher
export const useDeleteTeacher = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationFn: deleteTeacher,
          onSuccess: () => queryClient.invalidateQueries(["teachers"]),
     });
};

// EDIT teacher
export const useEditTeacher = () => {
     const queryClient = useQueryClient()
     return useMutation({
          mutationFn: editTeacher,
          onSuccess: () => queryClient.invalidateQueries(["teachers"]),
     })
}

// GET Availability Teacher
export const useAvailabilityTeacher = () => {
     return useQuery({
          queryKey: ["teachers"],
          queryFn: getAvailabilityTeacher,
          initialData: []
     })
}