import orderApiRequest from '@/api/order'

import { CreateOrderBodyType } from '@/schema/order-schema'

import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: ({ body, token }: { body: CreateOrderBodyType; token: string }) =>
      orderApiRequest.createOrder(body, token)
  })
}
