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
  // cart: any[]
  // addToCart: (product: any) => void
  // deleteCartItem: (id: number) => void
  // getAllCartItems: () => void

  // // Blogs
  // blogs: any[]
  // setBlogs: (blogs: any[]) => void

  // // Products
  // products: any[]
  // setProducts: (products: any[]) => void
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

  // // Cart
  // cart: [],
  // addToCart: async (product) => {
  //   set((state) => {
  //     const existingProductIndex = state.cart.findIndex((item) => item.id === product.id)
  //     let updatedCart
  //     if (existingProductIndex !== -1) {
  //       updatedCart = state.cart.map((item, index) =>
  //         index === existingProductIndex ? { ...item, quantity: item.quantity + 1 } : item
  //       )
  //     } else {
  //       updatedCart = [...state.cart, { ...product, quantity: 1 }]
  //     }
  //     return { cart: updatedCart }
  //   })

  //   const state = useAppStore.getState()
  //   await AsyncStorage.setItem('cart', JSON.stringify(state.cart))
  // },
  // deleteCartItem: async (id) => {
  //   set((state) => ({
  //     cart: state.cart.filter((item) => item.id !== id)
  //   }))

  //   const state = useAppStore.getState()
  //   await AsyncStorage.setItem('cart', JSON.stringify(state.cart))
  // },
  // getAllCartItems: async () => {
  //   const cart = await AsyncStorage.getItem('cart')
  //   if (cart) {
  //     set({ cart: JSON.parse(cart) })
  //   }
  // },

  // // Blogs
  // blogs: [],
  // setBlogs: (blogs) => set({ blogs }),

  // // Products
  // products: [],
  // setProducts: (products) => set({ products })
}))

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // const initializeData = async () => {
    //   const cart = await AsyncStorage.getItem('cart')
    //   if (cart) {
    //     useAppStore.setState({ cart: JSON.parse(cart) })
    //   }
    // }

    // initializeData()
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default AppProvider
