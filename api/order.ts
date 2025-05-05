import {
  CreateOrderBodyType,
  CreateOrderResType,
  DeleteOrderBodyType,
  DeleteOrderResType,
  GetAllOrderResType,
  GetOrderDetailsResType,
  RePurchaseOrderResType,
  UpdatePaymentMethodBodyType,
  UpdatePaymentMethodResType,
} from "@/schema/order-schema";
import http from "@/util/http";

const orderApiRequest = {
  createOrder: (body: CreateOrderBodyType, token: string) =>
    http.post<CreateOrderResType>(`orders`, body, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
        "User-Agent": "MobileKoine",
      },
    }),
  rePurchaseOrder: (token: string, orderId: string) =>
    http.post<RePurchaseOrderResType>(
      `orders/re-purchase/${orderId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "MobileKoine",
        },
      }
    ),
  getAll: ({
    page_size,
    page_index,
    token, //để authen
  }: {
    page_size: number;
    page_index: number;
    token: string;
  }) =>
    http.get<GetAllOrderResType>(
      `orders/my-orders?page_size=${page_size}&page_index=${page_index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }
    ),
  getOrderDetails: ({ orderId, token }: { orderId: string; token: string }) =>
    http.get<GetOrderDetailsResType>(`orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  deleteOrder: (orderId: string, body: DeleteOrderBodyType, token: string) =>
    http.delete<DeleteOrderResType>(`orders/${orderId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updatePaymentMethod: (
    orderId: string,
    body: UpdatePaymentMethodBodyType,
    token: string
  ) =>
    http.put<UpdatePaymentMethodResType>(`orders/pay-method/${orderId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default orderApiRequest;
