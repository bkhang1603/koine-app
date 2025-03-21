import authApiRequest from "@/api/auth";
import { CreateChildBodyType } from "@/schema/auth-schema";
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
//ví dụ cho có dùng token
/*
//cách này thì đc recommend hơn
export const useRefreshAccessMutation = () => {
  const { token } = useContext(AuthContext) // Lấy token từ context hoặc nơi lưu trữ khác
  return useMutation({
    mutationFn: (body: RefreshAccessBodyType) => 
      authApiRequest.getNewAccessToken(body, token)  // Truyền token vào khi gọi API
  })
}
//hoặc dùng cách dưới này không recommend vì token có thể bị thay đổi
export const useRefreshAccessMutation = (token: string) => {
  return useMutation({
    mutationFn: (body: RefreshAccessBodyType) => 
      authApiRequest.getNewAccessToken(body, token)  // Truyền token vào khi gọi API
  })
}
*/

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

//tất cả method khác thì viết như trên còn get thì dùng useQuery + 1 cái query key
//để những api chung 1 query key sẽ tự gọi nhau lúc 1 thg trigger

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
