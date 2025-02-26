import { CreateBlogCommentBodyType, CreateBlogCommentResType, CreateBlogReactBodyType, CreateBlogReactResType, GetAllBlogCommentsResType, GetAllBlogResType, GetBlogDetailResType } from '@/schema/blog-schema'
import http from '@/util/http'

const blogApiRequest = {
  getAll: ({
    keyword,
    page_size,
    page_index,
  }: {
    keyword: string
    page_size: number
    page_index: number
  }) =>
    http.get<GetAllBlogResType>(
      `blogs?keyword=${keyword}&page_size=${page_size}&page_index=${page_index}`
    ),
  getBlogDetail: ({ blogId, token }: { blogId: string; token: string }) =>
    http.get<GetBlogDetailResType>(`blogs/${blogId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getAllBlogComments: ({
    blogId,
    page_size,
    page_index,
  }: {
    blogId: string
    page_size: number
    page_index: number
  }) =>
    http.get<GetAllBlogCommentsResType>(
      `blog-comments/${blogId}?page_size=${page_size}&page_index=${page_index}`
    ),
  createBlogComment: (body: CreateBlogCommentBodyType, token: string) =>
    http.post<CreateBlogCommentResType>("blog-comments", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  createBlogReact: (body: CreateBlogReactBodyType, token: string) =>
    http.post<CreateBlogReactResType>("blog-reacts", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
}

export default blogApiRequest
