import { getAccessToken } from "@/config/utils/tokenStorage";

/**
 * API 요청용 인증 헤더
 * - accessToken이 있으면 Authorization Bearer 헤더 반환
 * - 없으면 빈 객체 (호출처에서 401 등 처리)
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}