import s3 from "@/api/s3";
import { UploadImageBodyType, UploadImageResType } from "@/schema/s3-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: ({
      body,
      token,
    }: {
      body: UploadImageBodyType;
      token: string;
    }) => s3.uploadImage(body, token),
  });
};
