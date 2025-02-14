import z from 'zod'

export const refreshToken = z
  .object({
    refreshToken: z.string(),
    expiresRefresh: z.string()
  })
  .strict()

export type RefreshTokenType = z.TypeOf<typeof refreshToken>

//tạo thêm mấy model khác để định nghĩa entity khác nếu cần
