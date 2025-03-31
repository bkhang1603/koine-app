import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import courseApiRequest from "@/api/course";
import {
  AssignCourseStoreBodyType,
  ChapterScoreBodyType,
  CourseElementResType,
  CreateCustomCourseType,
  EditChildCourseVisibleBodyType,
  GetMyCourseStoreResType,
} from "@/schema/course-schema";
import { useAppStore } from "@/components/app-provider";
import { RoleValues } from "@/constants/type";
import { useEffect } from "react";

export const useCourses = ({
  keyword,
  page_size,
  page_index,
}: {
  keyword: string;
  page_size: number;
  page_index: number;
}) => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () =>
      courseApiRequest.getAll({
        keyword,
        page_size,
        page_index,
      }),
  });
};

export const useCourseDetail = ({ courseId }: { courseId: string }) => {
  return useQuery({
    queryKey: ["course-detail", courseId],
    queryFn: () =>
      courseApiRequest.getCourseDetail({
        courseId,
      }),
    staleTime: 60 * 1000,
    enabled: !!courseId,
  });
};

export const useMyCourseStore = ({
  token,
  enabled,
}: {
  token: string;
  enabled: boolean;
}) => {
  const setMyCourse = useAppStore((state) => state.setMyCourse);
  const currentUser = useAppStore((state) => state.user);
  const query = useQuery<GetMyCourseStoreResType>({
    queryKey: ["my-courses-store"],
    queryFn: () =>
      courseApiRequest.getCourseInStorage(
        token // Truyền token vào khi gọi API
      ),
    enabled: enabled && !!token && currentUser?.role === RoleValues[0],
  });

  useEffect(() => {
    if (query.data) {
      setMyCourse(query.data); // Đảm bảo `data.data` có kiểu `GetAllCartDetailResType['data']`
    }
  }, [query.data, setMyCourse]);

  return query;
};

export const useAssignCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: AssignCourseStoreBodyType;
      token: string;
    }) => courseApiRequest.assignCourse({ body, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-courses-store"],
        exact: true,
      });
    },
  });
};

export const useEnrollFreeCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, courseId }: { token: string; courseId: string }) =>
      courseApiRequest.enrollFreeCourse({ token, courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-courses-store"],
        exact: true,
      });
    },
  });
};

export const useEditChildCourseVisible = () => {
  return useMutation({
    mutationFn: ({
      token,
      body,
    }: {
      token: string;
      body: EditChildCourseVisibleBodyType;
    }) => courseApiRequest.editChildCourseVisible({ token, body }),
  });
};

export const useCourseElement = ({ token }: { token: string }) => {
  const query = useQuery<CourseElementResType>({
    queryKey: ["course-element"],
    queryFn: () =>
      courseApiRequest.getCourseElement(
        token // Truyền token vào khi gọi API
      ),
  });

  return query;
};

export const useCreateCustomCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: CreateCustomCourseType;
      token: string;
    }) => courseApiRequest.createCustomCourse({ body, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["order"],
        exact: true,
      });
    },
  });
};

export const useChapterQuestion = ({
  chapterId,
  token,
}: {
  chapterId: string;
  token: string;
}) => {
  return useQuery({
    queryKey: ["chapter-question", chapterId],
    queryFn: () =>
      courseApiRequest.getChapterQuestions({
        token,
        chapterId,
      }),
    enabled: !!chapterId,
  });
};

export const useUpdateChapterScoreMutation = (
  courseId: string,
  chapterId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: ChapterScoreBodyType;
      token: string;
    }) => courseApiRequest.updateChapterScore({ body, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-courses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-course", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-chapter", chapterId],
      });
    },
  });
};
