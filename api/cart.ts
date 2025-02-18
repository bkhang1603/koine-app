import {
  DeleteCartItemBodyType,
  GetAllCartDetailResType,
  MessageResType,
  UpdateQuantityCartItemBodyType,
} from "@/schema/cart-schema";
import http from "@/util/http";

const cartApiRequest = {
  getAll: ({
    token, //để authen
  }: {
    token: string;
  }) =>
    http.get<GetAllCartDetailResType>(`mobile/cart`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  updateCartItemQuantity: (
    body: UpdateQuantityCartItemBodyType,
    token: string
  ) =>
    http.put<MessageResType>("carts/update-multiple", body, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  deleteCartItem: (body: DeleteCartItemBodyType, token: string) =>
    http.delete<MessageResType>("carts/delete-all", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default cartApiRequest;
