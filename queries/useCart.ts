import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import cartApiRequest from '@/api/cart'
import { UpdateQuantityCartItemBodyType } from '@/schema/cart-schema'

export const useCart = ({ token }: { token: string }) => {
  return useQuery({
    queryKey: ['carts'],
    queryFn: () => cartApiRequest.getAll({ token })
  })
}

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ body, token }: { body: UpdateQuantityCartItemBodyType; token: string }) =>
      cartApiRequest.updateCartItemQuantity(body, token),
    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi update
      queryClient.invalidateQueries({
        queryKey: ['carts'],
        exact: true // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      })
    }
  })
}

// 3. API delete item
export const useDeleteCartItemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cartDetailId, token }: { cartDetailId: string; token: string }) =>
      cartApiRequest.deleteCartItem(cartDetailId, token),
    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi delete
      queryClient.invalidateQueries({
        queryKey: ['carts'],
        exact: true // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      })
    }
  })
}
