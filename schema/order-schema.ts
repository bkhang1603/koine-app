import z from 'zod'

export const createOrderBody = z.object({
  arrayCartDetailIds: z.array(z.string()),
  deliveryInfoId: z.string()
})

export type CreateOrderBodyType = z.TypeOf<typeof createOrderBody>

export const createOrderRes = z.object({
  data: z.string()
})

export type CreateOrderResType = z.TypeOf<typeof createOrderRes>
