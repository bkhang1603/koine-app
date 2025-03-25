import {
  ChildProfileChildPageResType,
  CreateProgressBodyType,
  EditProfileBodyType,
  EditProfileResType,
  GetMyChapterDetailResType,
  GetMyChildCourseProgressResType,
  GetMyChildCoursesResType,
  GetMyChildsResType,
  GetMyCourseDetailResType,
  GetMyCoursesResType,
  GetMyLessonDetailResType,
  GetUserProfileResType,
  GetUserResType,
  LearningTimeBodyType,
  UpdateChildProfileByParent,
} from "@/schema/user-schema";
import http from "@/util/http";

const userApiRequest = {
  getAll: ({
    isDel,
    keyword,
    page_size,
    page_index,
    token, //để authen
  }: {
    isDel: string;
    keyword: string;
    page_size: number;
    page_index: number;
    token: string;
  }) =>
    http.get<GetUserResType>(
      `users?isDel=${isDel}&keyword=${keyword}&page_size=${page_size}&page_index=${page_index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }
    ),
  getMyCourses: ({ token }: { token: string }) =>
    http.get<GetMyCoursesResType>(`mobile/user-progress/my-courses`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  getCourseDetail: ({ courseId, token }: { courseId: string; token: string }) =>
    http.get<GetMyCourseDetailResType>(
      `mobile/user-progress/my-courses/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }
    ),
  getChapterDetail: ({
    chapterId,
    token,
  }: {
    chapterId: string;
    token: string;
  }) =>
    http.get<GetMyChapterDetailResType>(
      `mobile/user-progress/my-courses/chapter-detail/${chapterId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }
    ),
  getLessonDetail: ({ lessonId, token }: { lessonId: string; token: string }) =>
    http.get<GetMyLessonDetailResType>(
      `mobile/user-progress/my-courses/lesson-detail/${lessonId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }
    ),
  createProgress: (body: CreateProgressBodyType, token: string) =>
    http.post<any>(`user-progresses`, body, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  getUserProfile: ({ token }: { token: string }) =>
    http.get<GetUserProfileResType>(`users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  getMyChilds: (token: string) =>
    http.get<GetMyChildsResType>("users/my-child", {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),

  editProfile: ({
    body,
    token,
  }: {
    body: EditProfileBodyType;
    token: string;
  }) =>
    http.put<EditProfileResType>("users/profile", body, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),

  getMyChildCourse: ({ childId, token }: { childId: string; token: string }) =>
    http.get<GetMyChildCoursesResType>(`users/my-child-course/${childId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),

  editChildProfile: ({
    childId,
    body,
    token,
  }: {
    childId: string;
    body: UpdateChildProfileByParent;
    token: string;
  }) =>
    http.put<EditProfileResType>(`users/profile/${childId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),

  getMyChildCourseProgress: ({
    childId,
    courseId,
    token,
  }: {
    childId: string;
    courseId: string;
    token: string;
  }) =>
    http.get<GetMyChildCourseProgressResType>(
      `users/my-child-course-progress/${childId}/course/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }
    ),

  getProfileByChild: (token: string) =>
    http.get<ChildProfileChildPageResType>("users/profile-child", {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  stillLearning: (token: string) =>
    http.get<any>("user-progresses/still-learning", {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  updateLearningTime: (body: LearningTimeBodyType, token: string) =>
    http.put<any>("user-progresses/learning-time", body, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
};

export default userApiRequest;
