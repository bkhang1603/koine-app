import {
  GetAllCourseResType,
  GetCourseDetailResType,
} from "@/schema/course-schema";
import http from "@/util/http";

const courseApiRequest = {
  getAll: ({
    keyword,
    page_size,
    page_index,
  }: {
    keyword: string;
    page_size: number;
    page_index: number;
  }) =>
    http.get<GetAllCourseResType>(
      `courses?keyword=${keyword}&page_size=${page_size}&page_index=${page_index}`
    ),
  getCourseDetail: ({ courseId }: { courseId: string }) =>
    http.get<GetCourseDetailResType>(`courses/${courseId}`, {}),
};

export default courseApiRequest;
