import z from 'zod'

export const accessToken = z
  .object({
    accessToken: z.string(),
    expiresAccess: z.string(),
  })
  .strict()

export type AccessTokenType = z.TypeOf<typeof accessToken>

//tạo thêm mấy model khác để định nghĩa entity khác nếu cần
