import {
  AssignCourseStoreBodyType,
  AssignCourseStoreResType,
  EnrollFreeCourseResType,
  GetAllCourseResType,
  GetCourseDetailResType,
  GetMyCourseStoreResType,
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
  getCourseInStorage: (token: string) =>
    http.get<GetMyCourseStoreResType>("courses/my-store", {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  assignCourse: ({
    body,
    token,
  }: {
    body: AssignCourseStoreBodyType;
    token: string;
  }) =>
    http.post<AssignCourseStoreResType>("courses/active-course-enroll", body, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  enrollFreeCourse: ({
    token,
    courseId,
  }: {
    token: string;
    courseId: string;
  }) =>
    http.post<EnrollFreeCourseResType>(
      `courses/${courseId}/enroll-free`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
};

export default courseApiRequest;
