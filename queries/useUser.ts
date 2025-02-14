import { useMutation, useQuery } from '@tanstack/react-query'
import userApiRequest from '@/api/user'
import { CreateProgressBodyType } from '@/schema/user-schema'

export const useUser = ({
  isDel,
  keyword,
  page_size,
  page_index,
  token
}: {
  isDel: string
  keyword: string
  page_size: number
  page_index: number
  token: string
}) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () =>
      userApiRequest.getAll({
        isDel,
        keyword,
        page_size,
        page_index,
        token // Truyền token vào khi gọi API
      })
  })
}

export const useMyCourse = ({ token }: { token: string }) => {
  return useQuery({
    queryKey: ['my-courses'],
    queryFn: () =>
      userApiRequest.getMyCourses({
        token // Truyền token vào khi gọi API
      }),
    staleTime: 60 * 1000 // Cache 1 phút
    //refetchOnWindowFocus: false
  })
}

export const useMyCourseDetail = ({ courseId, token }: { courseId: string; token: string }) => {
  return useQuery({
    queryKey: ['my-course', courseId],
    queryFn: () =>
      userApiRequest.getCourseDetail({
        courseId,
        token // Truyền token vào khi gọi API
      }),
    staleTime: 60 * 1000, // Cache dữ liệu trong 1 phút trước khi bị coi là "stale"
    //refetchOnWindowFocus: false, // Không tự động fetch lại khi window được focus
    enabled: !!courseId // Chỉ fetch khi lessonId không bị null hoặc undefined
  })
}

export const useMyChapterDetail = ({ chapterId, token }: { chapterId: string; token: string }) => {
  return useQuery({
    queryKey: ['my-chapter', chapterId],
    queryFn: () =>
      userApiRequest.getChapterDetail({
        chapterId,
        token // Truyền token vào khi gọi API
      }),
    staleTime: 60 * 1000, // Cache dữ liệu trong 1 phút trước khi bị coi là "stale"
    //refetchOnWindowFocus: false, // Không tự động fetch lại khi window được focus
    enabled: !!chapterId // Chỉ fetch khi lessonId không bị null hoặc undefined
  })
}

export const useMyLessonDetail = ({ lessonId, token }: { lessonId: string; token: string }) => {
  return useQuery({
    queryKey: ['my-lesson', lessonId],
    queryFn: () =>
      userApiRequest.getLessonDetail({
        lessonId,
        token // Truyền token vào khi gọi API
      }),
    staleTime: 60 * 1000, // Cache dữ liệu trong 1 phút trước khi bị coi là "stale"
    //refetchOnWindowFocus: false, // Không tự động fetch lại khi window được focus
    enabled: !!lessonId // Chỉ fetch khi lessonId không bị null hoặc undefined
  })
}

export const useCreateProgressMutation = (token: string) => {
  return useMutation({
    mutationFn: (body: CreateProgressBodyType) => userApiRequest.createProgress(body, token) // Truyền token vào khi gọi API
  })
}
