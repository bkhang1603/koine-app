import { useMutation, useQuery } from "@tanstack/react-query";
import blogApiRequest from "@/api/blog";

export const useBlog = ({
  keyword,
  page_size,
  page_index,
}: {
  keyword: string;
  page_size: number;
  page_index: number;
}) => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: () =>
      blogApiRequest.getAll({
        keyword,
        page_size,
        page_index
      }),
  });
};

export const useBlogDetail = ({ blogId, token }: { blogId: string; token: string }) => {
  return useQuery({
    queryKey: ["blogs-detail", blogId],
    queryFn: () =>
      blogApiRequest.getBlogDetail({
        blogId,
        token,
      }),
    staleTime: 60 * 1000,
    enabled: !!blogId,
  });
};

export const useBlogComments = ({
  blogId,
  page_size,
  page_index,
}: {
  blogId: string
  page_size: number
  page_index: number
}) => {
  return useQuery({
    queryKey: ['blogs-comments', blogId],
    queryFn: () =>
      blogApiRequest.getAllBlogComments({
        blogId,
        page_size,
        page_index,
      }),
    enabled: !!blogId,
  })
}