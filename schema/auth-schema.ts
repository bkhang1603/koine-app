import { GenderValues, RoleValues } from '@/constants/type'
import z from 'zod'

export const loginBody = z
  .object({
    loginKey: z.string(),
    password: z.string()
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof loginBody>

export const loginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresAccess: z.string(),
    expiresRefresh: z.string(),
    account: z.object({
      id: z.string(),
      username: z.string(),
      email: z.string(),
      role: z.enum(RoleValues)
    })
  }),
  message: z.string(),
  statusCode: z.number()
})

export type LoginResType = z.TypeOf<typeof loginRes>

//refresh new access token
export const refreshAccessBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type RefreshAccessBodyType = z.TypeOf<typeof refreshAccessBody>

export const refreshAccessRes = z.object({
  data: z.object({
    accessToken: z.string(),
    expiresAccess: z.string(),
    refreshToken: z.string()
  }),
  message: z.string()
})

export type RefreshAccessResType = z.TypeOf<typeof refreshAccessRes>

export const registerBody = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])([A-Za-z\d!@#$%^&*()]+)$/),
    gender: z.enum(GenderValues),
    dob: z.string().regex(/^\d{4}-\d{1,2}-\d{1,2}$/)
  })
  .strict()

export type RegisterBodyType = z.TypeOf<typeof registerBody>

export const registerRes = z.object({
  data: z.unknown(), // Chỉnh lại sau vì api đang lỗi
  message: z.string(),
  statusCode: z.number()
})

export type RegisterResType = z.TypeOf<typeof registerRes>

export const checkRefreshBody = z
  .object({
    accessToken: z.string()
  })
  .strict()

export type CheckRefreshBodyType = z.TypeOf<typeof checkRefreshBody>

export const checkRefreshRes = z.object({
  data: z.string(),
  message: z.string()
})

export type CheckRefreshResType = z.TypeOf<typeof checkRefreshRes>
