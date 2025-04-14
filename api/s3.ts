import { UploadImageBodyType, UploadImageResType } from "@/schema/s3-schema";
import http from "@/util/http";

const s3 = {
  uploadImage: (body: UploadImageBodyType, token: string) =>
    http.post<UploadImageResType>("buckets/image", body, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  uploadFile: (body: UploadImageBodyType, token: string) =>
    http.post<any>("buckets/file", body, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default s3;
