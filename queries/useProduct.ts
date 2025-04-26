import { useQuery } from "@tanstack/react-query";
import productApiRequest from "@/api/product";

export const useAllProduct = ({ token }: { token: string }) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () =>
      productApiRequest.getAllProduct({
        token, // Truyền token vào khi gọi API
      }),
  });
};

export const useProductReviews = ({
  token,
  productId,
}: {
  token: string;
  productId: string;
}) => {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () =>
      productApiRequest.getProductReviews({
        token, // Truyền token vào khi gọi API
        productId,
      }),
  });
};
