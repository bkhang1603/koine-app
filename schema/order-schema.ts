import z from "zod";

export const createOrderBody = z.object({
  arrayCartDetailIds: z.array(z.string()),
  deliveryInfoId: z.string(),
  // sắp tới thêm cái delivery method có 2 options thì set cứng luôn
  deliMethod: z.string(),
  payMethod: z.string(),
});

export type CreateOrderBodyType = z.TypeOf<typeof createOrderBody>;

export const createOrderRes = z.object({
  data: z.object({
    orderId: z.string(),
    paymentLink: z.string(),
  }),
});

export type CreateOrderResType = z.TypeOf<typeof createOrderRes>;

export const orderRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.object({
    statistics: z.object({
      totalOrders: z.number(),
      totalCompletedAmount: z.number(),
      processingOrdersCount: z.number(),
      deliveryOrdersCount: z.number(),
    }),
    orders: z.array(
      z.object({
        id: z.string(),
        userId: z.string(),
        orderDate: z.string(),
        orderCode: z.string(),
        paymentMethod: z.string(),
        totalAmount: z.number(),
        deliMethod: z.string(),
        deliAmount: z.number(),
        status: z.string(),
        note: z.string().nullable(),
        isDeleted: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
        createdAtFormatted: z.string(),
        updatedAtFormatted: z.string(),
        orderStatusHistory: z.array(
          z.object({
            status: z.string(),
            timestamp: z.string(),
          })
        ),
        orderDetails: z.array(
          z.object({
            id: z.string(),
            orderId: z.string(),
            productId: z.string().nullable(),
            courseId: z.string().nullable(),
            comboId: z.string().nullable(),
            quantity: z.number(),
            unitPrice: z.number(),
            discount: z.number(),
            totalPrice: z.number(),
            itemTitle: z.string(),
            itemImageUrl: z.string(),
          })
        ),
        deliveryInfo: z
          .object({
            name: z.string().nullable().optional(),
            address: z.string().nullable().optional(),
            phone: z.string().nullable().optional(),
            status: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),

        payment: z.object({
          payMethod: z.string(),
          payDate: z.string(),
          payAmount: z.number(),
          payStatus: z.string(),
        }),
      })
    ),
  }),
  pagination: z.object({
    pageSize: z.number(),
    totalItem: z.number(),
    currentPage: z.number(),
    maxPageSize: z.number(),
    totalPage: z.number(),
  }),
});

export type GetAllOrderResType = z.infer<typeof orderRes>;

export const orderDetailsRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    userId: z.string(),
    orderDate: z.string(),
    totalAmount: z.number(),
    deliMethod: z.string(),
    deliAmount: z.number(),
    status: z.string(),
    note: z.string().nullable().optional(),
    isDeleted: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    orderCode: z.string(),
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
        totalPrice: z.number(),
        course: z
          .object({
            title: z.string(),
            description: z.string(),
            imageUrl: z.string(),
          })
          .nullable(),
        product: z
          .object({
            name: z.string(),
            description: z.string(),
            stockQuantity: z.number(),
            imageUrl: z.string(),
          })
          .nullable(),
        combo: z.null(),
      })
    ),
    createdAtFormatted: z.string(),
    updatedAtFormatted: z.string(),
    deliveryInfo: z
      .object({
        name: z.string().nullable().optional(),
        address: z.string().nullable().optional(),
        phone: z.string().nullable().optional(),
        status: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    payment: z.object({
      payMethod: z.string(),
      payDate: z.string().nullable(),
      payAmount: z.number().nullable(),
      payStatus: z.string().nullable(),
    }),
  }),
});

export type GetOrderDetailsResType = z.infer<typeof orderDetailsRes>;

export const deleteOrderBody = z.object({
  deletedNote: z.string(),
});

export type DeleteOrderBodyType = z.infer<typeof deleteOrderBody>;

export const deleteOrderRes = z.object({
  statusCode: z.number(),
  info: z.string().optional(),
  message: z.string(),
});

export type DeleteOrderResType = z.infer<typeof deleteOrderRes>;

export const rePurchaseOrderRes = z.object({
  data: z.string(),
});

export type RePurchaseOrderResType = z.TypeOf<typeof rePurchaseOrderRes>;

export const updatePaymentMethodBody = z.object({
  payMethod: z.string(),
});

export type UpdatePaymentMethodBodyType = z.infer<
  typeof updatePaymentMethodBody
>;

export const updatePaymentMethodRes = z.object({
  statusCode: z.number(),
  info: z.string().optional(),
  message: z.string(),
});

export type UpdatePaymentMethodResType = z.infer<typeof updatePaymentMethodRes>;
