import {
  CreateShippingAddressBodyType,
  CreateShippingAddressResType,
  GetAllShippingAddressResType,
} from "@/schema/shipping-infos-schema";
import http from "@/util/http";

const shippingAddressApiRequest = {
  getAllShippingAddress: ({
    token, //để authen
  }: {
    token: string;
  }) =>
    http.get<GetAllShippingAddressResType>(`delivery-infos`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  createShippingInfo: (body: CreateShippingAddressBodyType, token: string) =>
    http.post<CreateShippingAddressResType>("delivery-infos", body, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    }),
  deleteAddress: (id: string, token: string) =>
    http.delete<any>(
      `delivery-infos/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },
      }
    ),
};

export default shippingAddressApiRequest;
