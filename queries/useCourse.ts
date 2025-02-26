import { useMutation, useQuery } from "@tanstack/react-query";
import courseApiRequest from "@/api/course";
import { GetMyCourseStoreResType } from "@/schema/course-schema";
import { useAppStore } from "@/components/app-provider";
import { RoleValues } from "@/constants/type";
import { useEffect } from "react";

export const useCourses = ({
  keyword,
  page_size,
  page_index,
  token,
}: {
  keyword: string;
  page_size: number;
  page_index: number;
  token: string;
}) => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () =>
      courseApiRequest.getAll({
        keyword,
        page_size,
        page_index,
        token, // Truyền token vào khi gọi API
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

export const useMyCourseStore = ({token, enabled}:{token: string, enabled: boolean}) => {
  const setMyCourse = useAppStore(state => state.setMyCourse)
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
