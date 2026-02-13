import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentNotes,
    createStudentNote,
} from "../api/students.api";

export const useStudentsData = (params) => {
    return useQuery({
        queryKey: ["students", params],
        queryFn: () => getStudents(params),
        initialData: [],
    });
};

export const useStudent = (id) => {
    return useQuery({
        queryKey: ["student", id],
        queryFn: () => getStudent(id),
        initialData: [],
    });
};

export const useCreateStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries(["students"]);
        },
    });
};

export const useUpdateStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateStudent,
        onSuccess: () => {
            queryClient.invalidateQueries(["students"]);
        },
    });
};

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries(["students"]);
        },
    });
};

export const useStudentNotes = (id) => {
    return useQuery({
        queryKey: ["student-notes", id],
        queryFn: () => getStudentNotes(id),
        enabled: !!id,
        initialData: [],
    });
};

export const useCreateStudentNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createStudentNote,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["student-notes", variables.id]);
        },
    });
};