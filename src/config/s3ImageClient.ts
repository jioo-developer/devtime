/**
 * S3 presigned URL 업로드 전용.
 * baseUrl/Authorization 미사용 — presigned URL에 서명 포함.
 */
export async function putBinary(
  url: string,
  body: Blob | File,
  contentType: string,
): Promise<void> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body,
  });
  if (!res.ok) throw new Error("업로드에 실패했습니다.");
}
