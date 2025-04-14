import z from "zod";

export const cart = z.object({
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
});

export type CartType = z.TypeOf<typeof cart>;
