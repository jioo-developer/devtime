import { getAccessToken } from "@/config/utils/tokenStorage";

/**
 * 인증 헤더 반환 (ApiClient.get/post/put/delete의 headers 인자용)
 * - accessToken이 있으면 Authorization: Bearer <token> 포함
 * - 없으면 빈 객체 반환
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}
