import {
  AssignCourseStoreBodyType,
  AssignCourseStoreResType,
  CourseElementResType,
  EditChildCourseVisibleBodyType,
  EnrollFreeCourseResType,
  GetAllCourseResType,
  GetCourseDetailResType,
  GetMyCourseStoreResType,
  CreateCustomCourseType,
  GetChapterQuestionResType,
  ChapterScoreBodyType,
  GetCourseReviews,
} from "@/schema/course-schema";
import http from "@/util/http";
import { string } from "zod";

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
  getCourseInStorage: (token: string, page_index: number, page_size: number) =>
    http.get<GetMyCourseStoreResType>(
      `courses/my-store?page_size=${page_size}&page_index=${page_index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }
    ),
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
  editChildCourseVisible: ({
    body,
    token,
  }: {
    body: EditChildCourseVisibleBodyType;
    token: string;
  }) =>
    http.put<any>("course-visibilities", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getCourseElement: (token: string, page_index: number, page_size: number) =>
    http.get<CourseElementResType>(
      `courses/all-basic-course-info?page_size=${page_size}&page_index=${page_index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
  // api/course-customs/request-custom-course
  createCustomCourse: ({
    token,
    body,
  }: {
    token: string;
    body: CreateCustomCourseType;
  }) =>
    http.post<any>("course-customs/request-custom-course", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getChapterQuestions: ({
    token,
    chapterId,
    page_index,
    page_size,
  }: {
    token: string;
    chapterId: string;
    page_index: number;
    page_size: number;
  }) =>
    http.get<GetChapterQuestionResType>(
      `questions/my-quiz/${chapterId}?page_size=${page_size}&page_index=${page_index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
  updateChapterScore: ({
    token,
    body,
  }: {
    token: string;
    body: ChapterScoreBodyType;
  }) =>
    http.put<any>(`mobile/update-score`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getCourseReviews: ({
    token,
    courseId,
    page_index,
    page_size,
  }: {
    token: string;
    courseId: string;

    page_index: number;
    page_size: number;
  }) =>
    http.get<GetCourseReviews>(
      `courses/${courseId}/reviews?page_size=${page_size}&page_index=${page_index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
};

export default courseApiRequest;
