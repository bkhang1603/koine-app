import { useQuery } from "@tanstack/react-query";
import productApiRequest from "@/api/product";

export const useAllProduct = ({
  token,
  page_index,
  page_size,
}: {
  token: string;
  page_index: number;
  page_size: number;
}) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () =>
      productApiRequest.getAllProduct({
        token, // Truyền token vào khi gọi API
        page_index,
        page_size,
      }),
  });
};

export const useProductReviews = ({
  token,
  productId,
  page_index,
  page_size,
}: {
  token: string;
  productId: string;
  page_index: number;
  page_size: number;
}) => {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () =>
      productApiRequest.getProductReviews({
        token, // Truyền token vào khi gọi API
        productId,
        page_index,
        page_size,
      }),
  });
};
