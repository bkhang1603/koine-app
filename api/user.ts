import {
  CreateProgressBodyType,
  GetMyChapterDetailResType,
  GetMyCourseDetailResType,
  GetMyCoursesResType,
  GetMyLessonDetailResType,
  GetUserProfileResType,
  GetUserResType
} from '@/schema/user-schema'
import http from '@/util/http'

const userApiRequest = {
  getAll: ({
    isDel,
    keyword,
    page_size,
    page_index,
    token //để authen
  }: {
    isDel: string
    keyword: string
    page_size: number
    page_index: number
    token: string
  }) =>
    http.get<GetUserResType>(
      `users?isDel=${isDel}&keyword=${keyword}&page_size=${page_size}&page_index=${page_index}`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Thêm token vào headers
        }
      }
    ),
  getMyCourses: ({ token }: { token: string }) =>
    http.get<GetMyCoursesResType>(`mobile/user-progress/my-courses`, {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào headers
      }
    }),
  getCourseDetail: ({ courseId, token }: { courseId: string; token: string }) =>
    http.get<GetMyCourseDetailResType>(`mobile/user-progress/my-courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào headers
      }
    }),
  getChapterDetail: ({ chapterId, token }: { chapterId: string; token: string }) =>
    http.get<GetMyChapterDetailResType>(`mobile/user-progress/my-courses/chapter-detail/${chapterId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào headers
      }
    }),
  getLessonDetail: ({ lessonId, token }: { lessonId: string; token: string }) =>
    http.get<GetMyLessonDetailResType>(`mobile/user-progress/my-courses/lesson-detail/${lessonId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào headers
      }
    }),
  createProgress: (body: CreateProgressBodyType, token: string) =>
    http.post<any>(`user-progresses`, body, {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào headers
      }
    }),
    getUserProfile: ({ token }: { token: string }) =>
      http.get<GetUserProfileResType>(`users/profile`, {
        headers: {
          Authorization: `Bearer ${token}` // Thêm token vào headers
        }
      })
}

export default userApiRequest
