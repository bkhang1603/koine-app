import z from "zod";

export const courseRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      titleNoTone: z.string(),
      slug: z.string(),
      description: z.string(),
      durations: z.number(),
      imageUrl: z.string(),
      imageBanner: z.string(),
      price: z.number(),
      discount: z.number().optional(),
      totalEnrollment: z.number(),
      aveRating: z.number(),
      isBanned: z.boolean(),
      isCustom: z.boolean(),
      isDeleted: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
      createdAtFormatted: z.string(),
      updatedAtFormatted: z.string(),
      durationsDisplay: z.string(),
      level: z.string(),
      creatorId: z.string(),
      creator: z.object({
        id: z.string(),
        username: z.string(),
      }),
      categories: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
    })
  ),
  pagination: z.object({
    pageSize: z.number(),
    totalItem: z.number(),
    currentPage: z.number(),
    maxPageSize: z.number(),
    totalPage: z.number(),
  }),
});

export type GetAllCourseResType = z.infer<typeof courseRes>;

export const courseDetailRes = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
  data: z.object({
    isDeleted: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    id: z.string(),
    creatorId: z.string(),
    title: z.string(),
    titleNoTone: z.string(),
    slug: z.string(),
    description: z.string(),
    durations: z.number().optional(),
    imageUrl: z.string(),
    imageBanner: z.string(),
    price: z.number(),
    discount: z.number().optional(),
    totalEnrollment: z.number(),
    aveRating: z.number(),
    isBanned: z.boolean(),
    isCustom: z.boolean(),
    level: z.string(),
    durationsDisplay: z.string(),
    categories: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    chapters: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          durations: z.number(),
          durationsDisplay: z.string(),
          sequence: z.number(),
          lessons: z.array(
            z.object({
              id: z.string(),
              type: z.enum(["DOCUMENT", "VIDEO", "BOTH"]),
              title: z.string(),
              description: z.string(),
              durations: z.number(),
              content: z.string().nullable(),
              videoUrl: z.string().nullable(),
              sequence: z.number(),
              durationsDisplay: z.string(),
            })
          ),
        })
      )
      .optional(),
  }),
});

export type GetCourseDetailResType = z.infer<typeof courseDetailRes>;

export const myCourseStore = z.object({
  message: z.string(),
  data: z.object({
    totalItem: z.number(),
    details: z.array(
      z.object({
        course: z.object({
          id: z.string(),
          title: z.string(),
          level: z.string(),
          price: z.number(),
          durationDisplay: z.string(),
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

export type GetMyCourseStoreResType = z.infer<typeof myCourseStore>;

//assigncourse cho con là api/courses/active-course

export const assignCourse = z.object({
  childId: z.string().nullable(),
  courseId: z.string(),
});
  courseId: z.string(),
});

export type AssignCourseStoreBodyType = z.infer<typeof assignCourse>;

export const assignCourseResType = z.object({
  statusCode: z.number(),
  message: z.string(),
});
  message: z.string(),
});

export type AssignCourseStoreResType = z.infer<typeof assignCourseResType>;

export const enrollFreeCourseResType = z.object({
  statusCode: z.number(),
  info: z.string(),
  message: z.string(),
});
  message: z.string(),
});

export type EnrollFreeCourseResType = z.infer<typeof enrollFreeCourseResType>;

export const editChildCourseVisible = z.object({
  childId: z.string(),
  courseId: z.string(),
  isVisible: z.boolean(),
});

export type EditChildCourseVisibleBodyType = z.infer<
  typeof editChildCourseVisible
>;

export const courseElementResType = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      imageUrl: z.string(),
      totalChapter: z.number(),
      chapters: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          totalLesson: z.number(),
          description: z.number(),
          lessons: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
              type: z.string(),
            })
          ),
        })
      ),
    })
  ),
  message: z.string(),
});

export type CourseElementResType = z.infer<typeof courseElementResType>;

export const requestCustomCourse = z
  .object({
    chapterIds: z.array(z.string()),
  })

export type CreateCustomCourseType = z.infer<typeof requestCustomCourse>;
