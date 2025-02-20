import { UserType } from '@/model/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { create } from 'zustand'
import { AccessTokenType } from '@/model/access-token'
import { RefreshTokenType } from '@/model/refresh-token'
import React, { useEffect } from 'react'
import { RoleValues } from '@/constants/type'
import { ShippingAddressType } from '@/model/shipping-address'
import { CartType } from '@/model/cart'

const queryClient = new QueryClient()

type AppStoreType = {
  user: UserType | null
  setUser: (user: UserType) => void

  accessToken: AccessTokenType | null
  setAccessToken: (accessToken: AccessTokenType) => void

  refreshToken: RefreshTokenType | null
  setRefreshToken: (refreshToken: RefreshTokenType) => void
  clearAuth: () => void

  isRefreshExpired: boolean | false
  setRefreshExpired: (isRefreshExpired: boolean) => void
  isAccessExpired: boolean | false
  setAccessExpired: (isAccessExpired: boolean) => void

  shippingInfos: ShippingAddressType | null
  setShippingInfos: (shippingInfos: ShippingAddressType) => void

  // Courses
  // courses: any[]
  // setCourses: (courses: any[]) => void

  // Cart
  cart: CartType | null
  setCart: (cart: CartType) => void
}

export const useAppStore = create<AppStoreType>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  refreshToken: null,
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  clearAuth: () => set({ user: null, accessToken: null, refreshToken: null, shippingInfos: null, cart: null }),
  isRefreshExpired: false,
  setRefreshExpired: (isRefreshExpired) => set({ isRefreshExpired }),
  isAccessExpired: false,
  setAccessExpired: (isAccessExpired) => set({ isAccessExpired }),

  shippingInfos: null,
  setShippingInfos: (shippingInfos) => set({ shippingInfos }),

  cart: null,
  setCart: (cart) => set({ cart }),

  // Courses
  // courses: [],
  // setCourses: (courses) => set({ courses }),

}))

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default AppProvider
