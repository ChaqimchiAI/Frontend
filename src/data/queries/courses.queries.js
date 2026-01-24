import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse, deleteCourse, editCourse, getCourse, getCoursesData, updateCourse } from "../api/courses.api";

// GET all leads
export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCoursesData,
    initialData: [],
  });
};

// GET lead
export const useCourse = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourse,
    initialData: [],
  });
};

// CREATE new lead
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(["courses"]);  // cache yangilanadi
    },
  });
};

// UPDATE existing lead
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCourse,
    onSuccess: () => queryClient.invalidateQueries(["courses"]),
  });
};

// EDIT course
export const useEditCourse = () => {
     const queryClient = useQueryClient()
     return useMutation({
          mutationFn: editCourse,
          onSuccess: () => queryClient.invalidateQueries(["courses"])
     })
}

// DELETE lead
export const useDeleteCourses = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => queryClient.invalidateQueries(["courses"]),
  });
};