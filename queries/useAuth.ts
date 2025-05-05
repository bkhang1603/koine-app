import authApiRequest from "@/api/auth";
import { CreateChildBodyType, ForgotPasswordBody } from "@/schema/auth-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.login,
  });
};

export const useRefreshAccessMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.getNewAccessToken,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.register,
  });
};

export const useCheckRefreshMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.checkRefreshToken,
  });
};

export const useCreateChildMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: CreateChildBodyType;
      token: string;
    }) => authApiRequest.registerForChild(body, token),

    onSuccess: () => {
      // Invalidate queries liên quan đến giỏ hàng sau khi delete
      queryClient.invalidateQueries({
        queryKey: ["my-childs"],
        exact: true, // Tùy chọn, nếu bạn muốn invalidate chỉ những query khớp chính xác
      });
    },
  });
};

export const useConfirmOtpMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.confirmOtp,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ body }: { body: ForgotPasswordBody }) =>
      authApiRequest.forgotPassword(body),
  });
};
