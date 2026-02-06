/**
 * S3 프로필 이미지 베이스 URL 및 key/URL → 표시용 URL 변환
 */

const s3BaseUrlFromEnv =
  typeof process !== "undefined"
    ? process.env?.NEXT_PUBLIC_S3_IMAGE_BASE_URL
    : undefined;

if (!s3BaseUrlFromEnv) {
  throw new Error(
    "NEXT_PUBLIC_S3_IMAGE_BASE_URL is required. Set it in .env.development or .env.production",
  );
}

export const S3_IMAGE_BASE_URL = s3BaseUrlFromEnv.replace(/\/$/, "");

/** S3 객체 키 또는 이미 전체 URL → 표시용 이미지 URL 반환 */
export function getProfileImageUrl(
  imageKeyOrFullUrl: string | undefined | null,
): string {
  if (!imageKeyOrFullUrl) return "";
  if (
    imageKeyOrFullUrl.startsWith("http://") ||
    imageKeyOrFullUrl.startsWith("https://")
  ) {
    return imageKeyOrFullUrl;
  }
  return `${S3_IMAGE_BASE_URL}/${imageKeyOrFullUrl.replace(/^\//, "")}`;
}
