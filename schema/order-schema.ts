import z from 'zod'

export const createOrderBody = z.object({
  arrayCartDetailIds: z.array(z.string()),
  deliveryInfoId: z.string()
  // sắp tới thêm cái delivery method có 2 options thì set cứng luôn
})

export type CreateOrderBodyType = z.TypeOf<typeof createOrderBody>

export const createOrderRes = z.object({
  data: z.string()
})

export type CreateOrderResType = z.TypeOf<typeof createOrderRes>
