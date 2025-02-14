import { GetAllCourseResType } from '@/schema/course-schema'
import http from '@/util/http'

const courseApiRequest = {
  getAll: ({
    keyword,
    page_size,
    page_index,
    token //để authen
  }: {
    keyword: string
    page_size: number
    page_index: number
    token: string
  }) =>
    http.get<GetAllCourseResType>(`courses?keyword=${keyword}&page_size=${page_size}&page_index=${page_index}`, {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào headers
      }
    })
}

export default courseApiRequest
