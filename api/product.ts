import {
  GetAllProductResType,
  GetProductReviews,
} from "@/schema/product-schema";
import http from "@/util/http";

const productApiRequest = {
  getAllProduct: ({
    token, //để authen
    page_index,
    page_size,
  }: {
    token: string;
    page_index: number;
    page_size: number;
  }) =>
    http.get<GetAllProductResType>(
      `products?page_size=${page_size}&page_index=${page_index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }
    ),
  getProductReviews: ({
    token, //để authen
    productId,
    page_index,
    page_size,
  }: {
    token: string;
    productId: string;
    page_index: number;
    page_size: number;
  }) =>
    http.get<GetProductReviews>(
      `products/${productId}/reviews?page_size=${page_size}&page_index=${page_index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }
    ),
};

export default productApiRequest;
