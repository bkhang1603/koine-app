import { useMutation, useQuery } from '@tanstack/react-query'
import productApiRequest from '@/api/product'

export const useProduct = ({
  keyword,
  page_size,
  page_index,
  token
}: {
  keyword: string
  page_size: number
  page_index: number
  token: string
}) => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () =>
      productApiRequest.getAll({
        keyword,
        page_size,
        page_index,
        token // Truyền token vào khi gọi API
      })
  })
}
