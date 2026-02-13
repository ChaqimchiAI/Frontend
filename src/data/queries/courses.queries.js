import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse, deleteCourse, editCourse, getCourse, getCoursesData, updateCourse } from "../api/courses.api";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCoursesData,
    initialData: [],
  });
};

export const useCourse = (id) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(id),
    initialData: [],
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(["courses"]);
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCourse,
    onSuccess: () => queryClient.invalidateQueries(["courses"]),
  });
};

export const useEditCourse = () => {
     const queryClient = useQueryClient()
     return useMutation({
          mutationFn: editCourse,
          onSuccess: () => queryClient.invalidateQueries(["courses"])
     })
}

export const useDeleteCourses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => queryClient.invalidateQueries(["courses"]),
  });
};