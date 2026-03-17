import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAttendances, getStudentAttendances, getGroupAttendances, createAttendance } from "../api/attendances.api";

export const useAttendances = (id) => {
    return useQuery({
        queryKey: ["attendances", id],
        queryFn: () => getAttendances(id),
        initialData: []
    })
}

export const useStudentAttendances = (student_id, month, year) => {
    return useQuery({
        queryKey: ["student-attendances", student_id, month, year],
        queryFn: () => getStudentAttendances(student_id, month, year),
        initialData: []
    })
}

export const useGroupAttendances = (schedule_id) => {
    return useQuery({
        queryKey: ["group-attendances", schedule_id],
        queryFn: () => getGroupAttendances(schedule_id),
        enabled: !!schedule_id,
        initialData: []
    })
}

export const useCreateAttendance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => createAttendance(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["group-attendances"]);
            queryClient.invalidateQueries(["student-attendances"]);
            queryClient.invalidateQueries(["attendances"]);
        },
    })
}