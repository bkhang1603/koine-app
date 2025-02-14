import { GetAllCartDetailResType, MessageResType, UpdateQuantityCartItemBodyType } from '@/schema/cart-schema'
import http from '@/util/http'

const cartApiRequest = {
  getAll: ({
    token //để authen
  }: {
    token: string
  }) =>
    http.get<GetAllCartDetailResType>(`mobile/cart`, {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào headers
      }
    }),
  updateCartItemQuantity: (body: UpdateQuantityCartItemBodyType, token: string) =>
    http.put<MessageResType>('carts', body, {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào headers
      }
    }),
  deleteCartItem: (cartDetailId: string, token: string) =>
    http.delete<MessageResType>(`carts/${cartDetailId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào headers
      }
    })
}

export default cartApiRequest
