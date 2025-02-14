import z from 'zod'

export const shippingAddress = z.object({
  data: z.array(
    z.object({
      isDeleted: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
      id: z.string(),
      userId: z.string(),
      name: z.string(),
      phone: z.string(),
      address: z.string(),
      tag: z.string()
    })
  )
})

export type ShippingAddressType = z.TypeOf<typeof shippingAddress>
