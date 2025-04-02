import { GetAllProductResType } from "@/schema/product-schema";
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
};

export default productApiRequest;
