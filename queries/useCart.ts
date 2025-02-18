import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartApiRequest from "@/api/cart";
import {
  DeleteCartItemBodyType,
  GetAllCartDetailResType,
  UpdateQuantityCartItemBodyType,
} from "@/schema/cart-schema";
import { useAppStore } from "@/components/app-provider";
import { useEffect } from "react";
import { RoleValues } from "@/constants/type";

export const useCart = ({ token }: { token: string }) => {
  const setCart = useAppStore((state) => state.setCart); // Lấy setCart từ Zustand
  const currentUser = useAppStore((state) => state.user);
  const query = useQuery<GetAllCartDetailResType>({
    queryKey: ["carts"],
    queryFn: () => cartApiRequest.getAll({ token }),
    enabled: !!token && currentUser?.role === RoleValues[0],
  });

  useEffect(() => {
    if (query.data) {
      setCart(query.data.data); // Đảm bảo `data.data` có kiểu `GetAllCartDetailResType['data']`
    }
  }, [query.data, setCart]);

  return query;
};

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: UpdateQuantityCartItemBodyType;
      token: string;
    }) => cartApiRequest.updateCartItemQuantity(body, token),
    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi update
      queryClient.invalidateQueries({
        queryKey: ["carts"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
    },
  });
};

// 3. API delete item
export const useDeleteCartItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: DeleteCartItemBodyType;
      token: string;
    }) => cartApiRequest.deleteCartItem(body, token),

    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi delete
      queryClient.invalidateQueries({
        queryKey: ["carts"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
    },
  });
};
