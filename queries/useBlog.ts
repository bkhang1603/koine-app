import { useMutation, useQuery } from "@tanstack/react-query";
import blogApiRequest from "@/api/blog";

export const useBlog = ({
  keyword,
  page_size,
  page_index,
  token,
}: {
  keyword: string;
  page_size: number;
  page_index: number;
  token: string;
}) => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: () =>
      blogApiRequest.getAll({
        keyword,
        page_size,
        page_index,
        token, // Truyền token vào khi gọi API
      }),
  });
};

export const useBlogDetail = ({ blogId }: { blogId: string }) => {
  return useQuery({
    queryKey: ["blog-detail", blogId],
    queryFn: () =>
      blogApiRequest.getBlogDetail({
        blogId,
      }),
    staleTime: 60 * 1000,
    enabled: !!blogId,
  });
};
