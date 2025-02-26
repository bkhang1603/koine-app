import {
  CheckRefreshBodyType,
  CheckRefreshResType,
  CreateChildBodyType,
  CreateChildResType,
  LoginBodyType,
  LoginResType,
  RefreshAccessBodyType,
  RefreshAccessResType,
  RegisterBodyType,
  RegisterResType
} from '@/schema/auth-schema'
import http from '@/util/http'

const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>('mobile/login', body),
  getNewAccessToken: (body: RefreshAccessBodyType) => http.post<RefreshAccessResType>('mobile/refresh-token', body),
  register: (body: RegisterBodyType) => http.post<RegisterResType>('auth/register', body), //thg này chưa sửa url
  checkRefreshToken: (body: CheckRefreshBodyType) => http.post<CheckRefreshResType>('mobile/check-refresh', body),
  registerForChild: (body: CreateChildBodyType, token: string) => http.post<CreateChildResType>('auth/register-child', body, {
    headers: { Authorization: `Bearer ${token}` }
  })
  //ví dụ 1 hàm post cần token thì cần sửa ở đây và ở queries
  /*
  getNewAccessToken: (body: RefreshAccessBodyType, token: string) => 
    http.post<RefreshAccessResType>('mobile/refresh-token', body, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  */
}

export default authApiRequest
