import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getArchiveGroups,
    getArchiveGroup,
    patchArchiveGroupStatus,
    getArchiveGroupStudents,
    addStudentToArchiveGroup,
    getArchiveStudents,
    getArchiveStudent,
    getArchiveStudentEnrollmentHistory,
    getArchiveLeads,
    getArchiveLead,
} from "../api/archive.api";

// ═══════════════════════════════════════════════════════
//  GURUHLAR
// ═══════════════════════════════════════════════════════

/** Arxiv guruhlar ro'yxati */
export const useArchiveGroups = (params) =>
    useQuery({
        queryKey: ["archive", "groups", params],
        queryFn: () => getArchiveGroups(params),
        initialData: null,
    });

/** Arxiv guruh detail */
export const useArchiveGroup = (id) =>
    useQuery({
        queryKey: ["archive", "group", id],
        queryFn: () => getArchiveGroup(id),
        enabled: !!id,
        initialData: null,
    });

/** Guruh statusini o'zgartirish */
export const usePatchArchiveGroupStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: patchArchiveGroupStatus,
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries(["archive", "group", id]);
            queryClient.invalidateQueries(["archive", "groups"]);
        },
    });
};

/** Arxiv guruh o'quvchilari */
export const useArchiveGroupStudents = (id) =>
    useQuery({
        queryKey: ["archive", "group-students", id],
        queryFn: () => getArchiveGroupStudents(id),
        enabled: !!id,
        initialData: [],
    });

/** Arxiv guruhga o'quvchi qo'shish */
export const useAddStudentToArchiveGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addStudentToArchiveGroup,
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries(["archive", "group-students", id]);
            queryClient.invalidateQueries(["archive", "group", id]);
        },
    });
};

// ═══════════════════════════════════════════════════════
//  O'QUVCHILAR
// ═══════════════════════════════════════════════════════

/** Arxiv o'quvchilar ro'yxati */
export const useArchiveStudents = (params) =>
    useQuery({
        queryKey: ["archive", "students", params],
        queryFn: () => getArchiveStudents(params),
        initialData: null,
    });

/** Arxiv o'quvchi detail */
export const useArchiveStudent = (id) =>
    useQuery({
        queryKey: ["archive", "student", id],
        queryFn: () => getArchiveStudent(id),
        enabled: !!id,
        initialData: null,
    });

/** O'quvchining guruh tarixi (EnrollmentHistory) */
export const useArchiveStudentEnrollmentHistory = (id) =>
    useQuery({
        queryKey: ["archive", "student-enrollment-history", id],
        queryFn: () => getArchiveStudentEnrollmentHistory(id),
        enabled: !!id,
        initialData: [],
    });

// ═══════════════════════════════════════════════════════
//  LIDLAR
// ═══════════════════════════════════════════════════════

/** Arxiv lidlar ro'yxati */
export const useArchiveLeads = (params) =>
    useQuery({
        queryKey: ["archive", "leads", params],
        queryFn: () => getArchiveLeads(params),
        initialData: null,
    });

/** Arxiv lid detail */
export const useArchiveLead = (id) =>
    useQuery({
        queryKey: ["archive", "lead", id],
        queryFn: () => getArchiveLead(id),
        enabled: !!id,
        initialData: null,
    });
