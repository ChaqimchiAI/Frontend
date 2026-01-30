import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createRoom,
    deleteRoom,
    getRoomsData,
    getRoom,
    updateRoom,
    editRoom
} from "../api/room.api";

export const useRoomsData = () => {
    return useQuery({
        queryKey: ["rooms", "list"],
        queryFn: getRoomsData,
        initialData: []
    });
}

export const useRoomData = () => {
    useQuery({
        queryKey: ["rooms", "list"],
        queryFn: getRoom,
        initialData: []
    });
}

export const useCreateRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRoom,
        onSuccess: () => {
            queryClient.invalidateQueries(["rooms"]);
        },
    });
}

export const useUpdateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRoom,
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries(["rooms", "list"]);
            queryClient.invalidateQueries(["rooms", "detail", id]);
        },
    });
}

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRoom,
        onSuccess: () => {
            queryClient.invalidateQueries(["rooms", "list"]);
        },
    });
}

export const useEditRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editRoom,
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries(["rooms", "list"]);
            queryClient.invalidateQueries(["rooms", "detail", id]);
        },
    });
}
