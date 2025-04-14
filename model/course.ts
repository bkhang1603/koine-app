import z from "zod";

export const myCourseType = z.object({
  message: z.string(),
  data: z.object({
    totalItem: z.number(),
    details: z.array(
      z.object({
        course: z.object({
          id: z.string(),
          title: z.string(),
          level: z.string(),
          durationDisplay: z.string(),
          price: z.number(),
          categories: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
            })
          ),
          createAtFormatted: z.string(),
          imageUrl: z.string(),
        }),
        quantityAtPurchase: z.number(),
        unusedQuantity: z.number(),
        assignedTo: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            imageUrl: z.string(),
          })
        ),
      })
    ),
  }),
});

export type MyCourseType = z.infer<typeof myCourseType>;

export const myChildCourseType = z.array(
  z.object({
    course: z.object({
      id: z.string(),
      title: z.string(),
      level: z.string(),
      durationDisplay: z.string(),
      price: z.number(),
      categories: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
      createAtFormatted: z.string(),
      imageUrl: z.string(),
    }),
  })
);

export type MyChildCourseType = z.infer<typeof myChildCourseType>;
