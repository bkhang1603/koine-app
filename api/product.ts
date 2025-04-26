import { GetAllProductResType, GetProductReviews } from "@/schema/product-schema";
import http from "@/util/http";

const productApiRequest = {
  getAllProduct: ({
    token, //để authen
  }: {
    token: string;
  }) =>
    http.get<GetAllProductResType>(`products`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
    getProductReviews: ({
      token, //để authen
      productId
    }: {
      token: string;
      productId: string
    }) =>
      http.get<GetProductReviews>(`products/${productId}/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }),
};

export default productApiRequest;
