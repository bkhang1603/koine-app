import orderApiRequest from "@/api/order";
import {
  CreateOrderBodyType,
  DeleteOrderBodyType,
  UpdatePaymentMethodBodyType,
} from "@/schema/order-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: CreateOrderBodyType;
      token: string;
    }) => orderApiRequest.createOrder(body, token),
    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi delete
      queryClient.invalidateQueries({
        queryKey: ["order"], // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
      queryClient.invalidateQueries({
        queryKey: ["my-courses-store"], // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
      queryClient.invalidateQueries({
        queryKey: ["my-courses"],
      });
    },
  });
};

export const useRePurchaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, token }: { orderId: string; token: string }) =>
      orderApiRequest.rePurchaseOrder(token, orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["order"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-courses-store"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-courses"], // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
    },
  });
};

export const useOrder = ({
  page_size,
  page_index,
  token,
}: {
  page_size: number;
  page_index: number;
  token: string;
}) => {
  return useQuery({
    queryKey: ["order"],
    queryFn: () =>
      orderApiRequest.getAll({
        page_size,
        page_index,
        token,
      }),
    enabled: !!token,
    retry: 2,
    staleTime: 30 * 1000,
  });
};

export const useOrderDetails = ({
  orderId,
  token,
}: {
  orderId: string;
  token: string;
}) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () =>
      orderApiRequest.getOrderDetails({
        orderId,
        token,
      }),
    staleTime: 60 * 1000,
    enabled: !!orderId,
  });
};

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      body,
      token,
    }: {
      orderId: string;
      body: DeleteOrderBodyType;
      token: string;
    }) => orderApiRequest.deleteOrder(orderId, body, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["order"],
        exact: true,
      });
    },
  });
};

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      body,
      token,
    }: {
      orderId: string;
      body: UpdatePaymentMethodBodyType;
      token: string;
    }) => orderApiRequest.updatePaymentMethod(orderId, body, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["order"],
      });
    },
  });
};
