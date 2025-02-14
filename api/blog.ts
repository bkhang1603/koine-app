
import { GetAllBlogResType } from '@/schema/blog-schema'
import http from '@/util/http'

const blogApiRequest = {
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
    http.get<GetAllBlogResType>(
      `blogs?keyword=${keyword}&page_size=${page_size}&page_index=${page_index}`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Thêm token vào headers
        }
      }
    )
}

export default blogApiRequest
