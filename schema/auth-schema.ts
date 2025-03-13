import { GenderValues, RoleValues } from "@/constants/type";
import z from "zod";

export const loginBody = z
  .object({
    loginKey: z.string(),
    password: z.string(),
    deviceId: z.string()
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof loginBody>;

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
      role: z.enum(RoleValues),
    }),
  }),
  message: z.string(),
  statusCode: z.number(),
});
// || z.object({
//   message: z.string(),
//   statusCode: z.number()
// }) || z.object({
//   message: z.string(),
//   statusCode: z.number(),
//   info: z.string(),
//   details: z.array(
//     z.string()
//   )
// })

export type LoginResType = z.TypeOf<typeof loginRes>;

//refresh new access token
export const refreshAccessBody = z
  .object({
    refreshToken: z.string()
  })
  .strict();

export type RefreshAccessBodyType = z.TypeOf<typeof refreshAccessBody>;

export const refreshAccessRes = z.object({
  data: z.object({
    accessToken: z.string(),
    expiresAccess: z.string(),
    refreshToken: z.string(),
  }),
  message: z.string(),
  statusCode: z.number(),
});

export type RefreshAccessResType = z.TypeOf<typeof refreshAccessRes>;

export const registerBody = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  gender: z.string(),
  dob: z.string(),
  address: z.string(),
  role: z.string()
});

export type RegisterBodyType = z.TypeOf<typeof registerBody>;

export const registerRes = z.object({
  data: z.unknown(), // Chỉnh lại sau vì api đang lỗi
  message: z.string(),
  statusCode: z.number(),
});

export type RegisterResType = z.TypeOf<typeof registerRes>;

export const checkRefreshBody = z
  .object({
    accessToken: z.string(),
  })
  .strict();

export type CheckRefreshBodyType = z.TypeOf<typeof checkRefreshBody>;

export const checkRefreshRes = z.object({
  data: z.string(),
  message: z.string(),
});

export type CheckRefreshResType = z.TypeOf<typeof checkRefreshRes>;

export const createChildBodyType = z.object({
  username: z.string(),
  password: z.string(),
  gender: z.string(),
  dob: z.string(),
});

export type CreateChildBodyType = z.TypeOf<typeof createChildBodyType>;

export const createChildResType = z.object({
  message: z.string(),
});

export type CreateChildResType = z.TypeOf<typeof createChildResType>;
