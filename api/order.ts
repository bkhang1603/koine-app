import {
  CreateOrderBodyType,
  CreateOrderResType,
  GetAllOrderResType,
  GetOrderDetailsResType,
} from "@/schema/order-schema";
import http from "@/util/http";

const orderApiRequest = {
  createOrder: (body: CreateOrderBodyType, token: string) =>
    http.post<CreateOrderResType>(`orders`, body, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  getAll: ({
    page_size,
    page_index,
    token, //để authen
  }: {
    page_size: number;
    page_index: number;
    token: string;
  }) =>
    http.get<GetAllOrderResType>(`orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  getOrderDetails: ({ orderId, token }: { orderId: string; token: string }) =>
    http.get<GetOrderDetailsResType>(`orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default orderApiRequest;
