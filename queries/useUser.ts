import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userApiRequest from "@/api/user";
import {
  CreateProgressBodyType,
  EditProfileBodyType,
  GetMyChildsResType,
  GetUserProfileResType,
} from "@/schema/user-schema";
import { useAppStore } from "@/components/app-provider";
import { RoleValues } from "@/constants/type";
import { useEffect } from "react";

export const useUser = ({
  isDel,
  keyword,
  page_size,
  page_index,
  token,
}: {
  isDel: string;
  keyword: string;
  page_size: number;
  page_index: number;
  token: string;
}) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () =>
      userApiRequest.getAll({
        isDel,
        keyword,
        page_size,
        page_index,
        token, // Truyền token vào khi gọi API
      }),
  });
};

export const useMyCourse = ({ token }: { token: string }) => {
  return useQuery({
    queryKey: ["my-courses"],
    queryFn: () =>
      userApiRequest.getMyCourses({
        token, // Truyền token vào khi gọi API
      }),
    staleTime: 60 * 1000, // Cache 1 phút
    //refetchOnWindowFocus: false
  });
};

export const useMyCourseDetail = ({
  courseId,
  token,
}: {
  courseId: string;
  token: string;
}) => {
  return useQuery({
    queryKey: ["my-course", courseId],
    queryFn: () =>
      userApiRequest.getCourseDetail({
        courseId,
        token, // Truyền token vào khi gọi API
      }),
    staleTime: 60 * 1000, // Cache dữ liệu trong 1 phút trước khi bị coi là "stale"
    //refetchOnWindowFocus: false, // Không tự động fetch lại khi window được focus
    enabled: !!courseId, // Chỉ fetch khi lessonId không bị null hoặc undefined
  });
};

export const useMyChapterDetail = ({
  chapterId,
  token,
}: {
  chapterId: string;
  token: string;
}) => {
  return useQuery({
    queryKey: ["my-chapter", chapterId],
    queryFn: () =>
      userApiRequest.getChapterDetail({
        chapterId,
        token, // Truyền token vào khi gọi API
      }),
    staleTime: 60 * 1000, // Cache dữ liệu trong 1 phút trước khi bị coi là "stale"
    //refetchOnWindowFocus: false, // Không tự động fetch lại khi window được focus
    enabled: !!chapterId, // Chỉ fetch khi lessonId không bị null hoặc undefined
  });
};

export const useMyLessonDetail = ({
  lessonId,
  token,
}: {
  lessonId: string;
  token: string;
}) => {
  return useQuery({
    queryKey: ["my-lesson", lessonId],
    queryFn: () =>
      userApiRequest.getLessonDetail({
        lessonId,
        token, // Truyền token vào khi gọi API
      }),
    staleTime: 60 * 1000, // Cache dữ liệu trong 1 phút trước khi bị coi là "stale"
    //refetchOnWindowFocus: false, // Không tự động fetch lại khi window được focus
    enabled: !!lessonId, // Chỉ fetch khi lessonId không bị null hoặc undefined
  });
};

export const useCreateProgressMutation = (token: string) => {
  return useMutation({
    mutationFn: (body: CreateProgressBodyType) =>
      userApiRequest.createProgress(body, token), // Truyền token vào khi gọi API
  });
};

export const useUserProfile = ({
  token,
  enabled,
}: {
  token: string;
  enabled: boolean;
}) => {
  const setProfile = useAppStore((state) => state.setProfile);
  const query = useQuery<GetUserProfileResType>({
    queryKey: ["users-profile"],
    queryFn: () =>
      userApiRequest.getUserProfile({
        token, // Truyền token vào khi gọi API
      }),
    enabled: enabled,
  });

  useEffect(() => {
    if (query.data) {
      setProfile(query.data); // Đảm bảo `data.data` có kiểu `GetAllCartDetailResType['data']`
    }
  }, [query.data, setProfile]);

  return query;
};

export const useMyChilds = ({
  token,
  enabled,
}: {
  token: string;
  enabled: boolean;
}) => {
  const setChilds = useAppStore((state) => state.setChilds);
  const currentUser = useAppStore((state) => state.user);
  const query = useQuery<GetMyChildsResType>({
    queryKey: ["my-childs"],
    queryFn: () => userApiRequest.getMyChilds(token),
    enabled: enabled && !!token && currentUser?.role === RoleValues[0],
  });

  useEffect(() => {
    if (query.data) {
      setChilds(query.data.data); // Đảm bảo `data.data` có kiểu `GetAllCartDetailResType['data']`
    }
  }, [query.data, setChilds]);

  return query;
};

export const useEditProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: EditProfileBodyType;
      token: string;
    }) => userApiRequest.editProfile({ body, token }), // Truyền token vào khi gọi API
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users-profile"],
        exact: true,
      });
    },
  });
};
