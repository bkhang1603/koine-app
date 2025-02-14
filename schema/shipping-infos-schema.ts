import z from 'zod'

export const getAllShippingAddress = z.object({
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

export type GetAllShippingAddressResType = z.TypeOf<typeof getAllShippingAddress>

export const createShippingAddressBody = z.object({
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  tag: z.string()
})

export type CreateShippingAddressBodyType = z.TypeOf<typeof createShippingAddressBody>

export const createShippingAddressResType = z.object({
  data: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    tag: z.string(),
    isDeleted: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    id: z.string(),
    userId: z.string()
  })
})

export type CreateShippingAddressResType = z.TypeOf<typeof createShippingAddressResType>
