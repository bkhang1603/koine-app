import { useMutation, useQuery } from '@tanstack/react-query'
import courseApiRequest from '@/api/course'

export const useCourses = ({
  keyword,
  page_size,
  page_index
}: {
  keyword: string
  page_size: number
  page_index: number
}) => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () =>
      courseApiRequest.getAll({
        keyword,
        page_size,
        page_index
      })
  })
}

export const useCourseDetail = ({ courseId }: { courseId: string }) => {
  return useQuery({
    queryKey: ['course-detail', courseId],
    queryFn: () =>
      courseApiRequest.getCourseDetail({
        courseId
      }),
    staleTime: 60 * 1000,
    enabled: !!courseId
  })
}
