import { GetAllCartDetailResType, MessageResType, UpdateQuantityCartItemBodyType } from '@/schema/cart-schema'
import { CreateOrderBodyType, CreateOrderResType } from '@/schema/order-schema'
import http from '@/util/http'

const orderApiRequest = {
  createOrder: (body: CreateOrderBodyType, token: string) =>
    http.post<CreateOrderResType>(`orders`, body, {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào headers
      }
    })
}

export default orderApiRequest
