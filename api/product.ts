import { GetAllProductResType } from "@/schema/product-schema";
import http from "@/util/http";

const productApiRequest = {
  getAll: ({
    keyword,
    page_size,
    page_index,
    token, //để authen
  }: {
    keyword: string;
    page_size: number;
    page_index: number;
    token: string;
  }) =>
    http.get<GetAllProductResType>(
      `category-products?keyword=${keyword}&page_size=${page_size}&page_index=${page_index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }
    ),

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
};

export default productApiRequest;
