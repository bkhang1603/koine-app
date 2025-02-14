import shippingAddressApiRequest from '@/api/shipping-infos'
import { CreateShippingAddressBodyType } from '@/schema/shipping-infos-schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useShippingInfos = ({ token }: { token: string }) => {
  return useQuery({
    queryKey: ['shipping-infos'],
    queryFn: () =>
      shippingAddressApiRequest.getAllShippingAddress({
        token // Truyền token vào khi gọi API
      })
  })
}

export const useCreateShippingInfos = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ body, token }: { body: CreateShippingAddressBodyType; token: string }) =>
      shippingAddressApiRequest.createShippingInfo(body, token),
    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi update
      queryClient.invalidateQueries({
        queryKey: ['shipping-infos'],
        exact: true // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      })
    }
  })
}
