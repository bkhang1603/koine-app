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

export const orderRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      orderDate: z.string(),
      totalAmount: z.number(),
      status: z.string(),
      isDeleted: z.boolean(),
      deletedNote: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
      orderDetails: z.array(
        z.object({
          isDeleted: z.boolean(),
          createdAt: z.string(),
          updatedAt: z.string(),
          id: z.string(),
          orderId: z.string(),
          productId: z.string().nullable(),
          courseId: z.string().nullable(),
          comboId: z.string().nullable(),
          quantity: z.number(),
          unitPrice: z.number(),
          discount: z.number(),
          totalPrice: z.number()
        })
      ),
      deliveryInfo: z.object({
        name: z.string(),
        address: z.string(),
        phone: z.string(),
        status: z.string()
      })
    })
  ),
  pagination: z.object({
    pageSize: z.number(),
    totalItem: z.number(),
    currentPage: z.number(),
    maxPageSize: z.number(),
    totalPage: z.number()
  })
})

export type GetAllOrderResType = z.infer<typeof orderRes>

export const orderDetailsRes = z.object({
    statusCode: z.number(),
    info: z.string(),
    message: z.string(),
    data: z.object({
      isDeleted: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
      id: z.string(),
      userId: z.string(),
      orderDate: z.string(),
      totalAmount: z.number(),
      status: z.string(),
      deletedNote: z.string().nullable(),
      orderDetails: z.array(z.object({
        isDeleted: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
        id: z.string(),
        orderId: z.string(),
        productId: z.string().nullable(),
        courseId: z.string().nullable(),
        comboId: z.string().nullable(),
        quantity: z.number(),
        unitPrice: z.number(),
        discount: z.number(),
        totalPrice: z.number(),
        course: z.object({
            title: z.string(),
            description: z.string(),
            imageUrl: z.string(),
          }).optional().nullable(),
        product: z.object({}).optional().nullable(),
        combo: z.object({}).optional().nullable(),
      })),
      createdAtFormatted: z.string(),
      updatedAtFormatted: z.string(),
  })
})

export type GetOrderDetailsResType = z.infer<typeof orderDetailsRes>