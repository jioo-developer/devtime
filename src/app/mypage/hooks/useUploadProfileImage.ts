import { ApiClient } from "@/config/apiConfig/apiConfig";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";
import type { ApiRequest, ApiResponse } from "@/types/api/helpers";

/** POST /api/file/presigned-url 요청 (generated.ts 기반) */
export type PresignedUrlRequest = ApiRequest<"/api/file/presigned-url", "post">;

/** POST /api/file/presigned-url 200 응답 (generated.ts 기반) */
export type PresignedUrlResponse = ApiResponse<
  "/api/file/presigned-url",
  "post",
  200
>;

/**
 * Presigned URL 발급 → S3 PUT 업로드 → key 반환.
 * 반환된 key를 PUT /api/profile 의 profileImage 로 전달.
 */
export function useUploadProfileImage() {
  async function uploadFile(file: File): Promise<string | null> {
    try {
      const payload: PresignedUrlRequest = {
        fileName: file.name,
        contentType: file.type,
      };
      const { presignedUrl, key: s3ObjectKey } =
        await AuthenticatedApiClient.post("/api/file/presigned-url", payload);

      await ApiClient.uploadImageToS3(presignedUrl, file, file.type);
      return s3ObjectKey;
    } catch {
      return null;
    }
  }

  return { upload: uploadFile };
}
