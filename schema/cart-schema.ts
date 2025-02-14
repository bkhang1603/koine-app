import z from 'zod'

export const updateQuantityCartItem = z
  .object({
    cartDetailId: z.string(),
    quantity: z.number()
  })
  .strict()

export type UpdateQuantityCartItemBodyType = z.TypeOf<typeof updateQuantityCartItem>

export const messageRes = z.object({
  message: z.string()
})

export type MessageResType = z.TypeOf<typeof messageRes>

export const deleteCartItem = z
  .object({
    cartDetailId: z.string()
  })
  .strict()

export type DeleteCartItemBodyType = z.TypeOf<typeof deleteCartItem>

export const cartItemList = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    userId: z.string(),
    totalItems: z.number(),
    totalAmount: z.number(),
    isDeleted: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdAtFormatted: z.string(),
    updatedAtFormatted: z.string(),
    cartDetails: z.array(
      z.object({
        id: z.string(),
        cartId: z.string(),
        productId: z.string(),
        courseId: z.string(),
        comboId: z.string(),
        quantity: z.number(),
        unitPrice: z.number(),
        discount: z.number(),
        totalPrice: z.number(),
        isDeleted: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        objectName: z.string(),
        objectDescription: z.string(),
        objectImageUrl: z.string()
      })
    )
  })
})

export type GetAllCartDetailResType = z.TypeOf<typeof cartItemList>
