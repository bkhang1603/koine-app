import z from "zod";

export const updateQuantityCartItem = z.array(
  z.object({
    cartDetailId: z.string(),
    quantity: z.number(),
  })
);

export type UpdateQuantityCartItemBodyType = z.TypeOf<
  typeof updateQuantityCartItem
>;

export const messageRes = z.object({
  message: z.string(),
});

export type MessageResType = z.TypeOf<typeof messageRes>;

export const deleteCartItems = z
  .object({
    arrayCartDetailIds: z.array(z.string().uuid()),
  })
  .strict();

export type DeleteCartItemBodyType = z.TypeOf<typeof deleteCartItems>;

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
        objectImageUrl: z.string(),
      })
    ),
  }),
});

export type GetAllCartDetailResType = z.TypeOf<typeof cartItemList>

export const createCartDetailBody = z.object({
  courseId: z.string().optional(),
  productId: z.string().optional(),
  comboId: z.string().optional(),
  quantity: z.number(),
})


export type CreateCartDetailBodyType = z.infer<typeof createCartDetailBody>;

export const createCartDetailRes = z.object({
    statusCode: z.number(),
    info: z.string(),
    message: z.string(),
  });
  
export type CreateCartDetailResType = z.infer<typeof createCartDetailRes>;
