import { GenderValues, RoleValues } from '@/constants/type'
import z from 'zod'

export const blogRes = z.object({
  data: z.array(
    z.object({
      creatorId: z.string(),
      title: z.string(),
      titleNoTone: z.string(),
      slug: z.string(),
      content: z.string(),
      imageUrl: z.string(),
      description: z.string(),
      isDeleted: z.boolean(),
      createAt: z.string(),
      updateAt: z.string(),
      id: z.string(),
      status: z.string(),
      createAtFormatted: z.string(),
      updateAtFormatted: z.string()
    })
  ),
  message: z.string()
})

export type GetAllBlogResType = z.TypeOf<typeof blogRes>
