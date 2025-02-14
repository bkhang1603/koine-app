import { RoleValues } from '@/constants/type'
import z from 'zod'

export const user = z
  .object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    role: z.enum(RoleValues)
  })
  .strict()

export type UserType = z.TypeOf<typeof user>

//tạo thêm mấy model khác để định nghĩa entity khác nếu cần
