import {
  createCartDetailBody,
  CreateCartDetailBodyType,
  createCartDetailRes,
  CreateCartDetailResType,
} from "./../schema/cart-schema";
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
    http.put<MessageResType>("carts/delete-multiple", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  createCartItem: (body: CreateCartDetailBodyType, token: string) =>
    http.post<CreateCartDetailResType>("carts", body, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
};

export default cartApiRequest;
