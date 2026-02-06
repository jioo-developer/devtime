import { ApiClient } from "@/config/apiConfig/apiConfig";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";

/**
 * 가이드: Presigned URL 발급 → S3 PUT 업로드 → key 반환.
 * 반환된 key를 PUT /api/profile 의 profileImage 로 전달.
 */
export function useUploadProfileImage() {
  async function uploadFile(file: File): Promise<string | null> {
    try {
      const { presignedUrl, key: s3ObjectKey } =
        await AuthenticatedApiClient.post("/api/file/presigned-url", {
          fileName: file.name,
          contentType: file.type,
        });

      await ApiClient.putBinary(presignedUrl, file, file.type);
      return s3ObjectKey;
    } catch {
      return null;
    }
  }

  return { upload: uploadFile };
}
