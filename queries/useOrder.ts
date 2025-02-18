import orderApiRequest from "@/api/order";
import { CreateOrderBodyType } from "@/schema/order-schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: CreateOrderBodyType;
      token: string;
    }) => orderApiRequest.createOrder(body, token),
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
  });
};

export const useOrderDetail = ({
  orderId,
  token,
}: {
  orderId: string;
  token: string;
}) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () =>
      orderApiRequest.getOrderDetail({
        orderId,
        token,
      }),
    staleTime: 60 * 1000,
    enabled: !!orderId,
  });
};
