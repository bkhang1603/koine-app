import shippingAddressApiRequest from "@/api/shipping-infos";
import { useAppStore } from "@/components/app-provider";
import { RoleValues } from "@/constants/type";
import {
  CreateShippingAddressBodyType,
  GetAllShippingAddressResType,
} from "@/schema/shipping-infos-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useShippingInfos = ({
  token,
  enabled,
}: {
  token: string;
  enabled: boolean;
}) => {
  const setShippingInfos = useAppStore((state) => state.setShippingInfos);
  const currentUser = useAppStore((state) => state.user);
  const query = useQuery<GetAllShippingAddressResType>({
    queryKey: ["shipping-infos"],
    queryFn: () =>
      shippingAddressApiRequest.getAllShippingAddress({
        token, // Truyền token vào khi gọi API
      }),
    enabled: enabled && !!token && currentUser?.role === RoleValues[0],
  });

  useEffect(() => {
    if (query.data) {
      setShippingInfos(query.data); // Đảm bảo `data.data` có kiểu `GetAllCartDetailResType['data']`
    }
  }, [query.data, setShippingInfos]);

  return query;
};

export const useCreateShippingInfos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: CreateShippingAddressBodyType;
      token: string;
    }) => shippingAddressApiRequest.createShippingInfo(body, token),
    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi update
      queryClient.invalidateQueries({
        queryKey: ["shipping-infos"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
    },
  });
};

export const useDeleteShippingInfos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ addressId, token }: { addressId: string; token: string }) =>
      shippingAddressApiRequest.deleteAddress(addressId, token),
    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi update
      queryClient.invalidateQueries({
        queryKey: ["shipping-infos"],
      });
    },
  });
};
