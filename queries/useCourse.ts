import { useMutation, useQuery } from '@tanstack/react-query'
import courseApiRequest from '@/api/course'

export const useCourses = ({
  keyword,
  page_size,
  page_index,
  token
}: {
  keyword: string
  page_size: number
  page_index: number
  token: string
}) => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () =>
      courseApiRequest.getAll({
        keyword,
        page_size,
        page_index,
        token // Truyền token vào khi gọi API
      })
  })
}
