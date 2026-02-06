import { getRefreshToken, setTokens } from "./tokenStorage";
import { ApiClient } from "@/config/apiConfig/apiConfig";
import type { ApiResponseSuccess } from "@/types/api/helpers";

interface RefreshResponse extends ApiResponseSuccess<
  "/api/auth/refresh",
  "post"
> {
  refreshToken?: string;
}

// 동시에 여러 refresh 요청이 발생하지 않도록 막는 lock 변수
let refreshPromise: Promise<string | null> | null = null;

/**
 * Access Token 갱신 함수
 *
 * - 동시에 여러 401이 발생해도 refresh 요청은 1번만 실행
 * - refreshToken이 없거나 refresh 실패 시 null 반환
 * - 성공 시 새 accessToken 반환 및 토큰 저장소 갱신
 */
export function refreshAccessToken(): Promise<string | null> {
  // 1) 저장된 refreshToken 가져오기
  const refreshToken = getRefreshToken();

  // 2) refreshToken이 없으면 더 이상 시도하지 않고 즉시 종료
  if (!refreshToken) return Promise.resolve(null);

  // 3) 이미 refresh 요청이 진행 중이면
  //    새로 요청하지 않고 기존 Promise 결과를 그대로 공유
  if (refreshPromise) return refreshPromise;

  // 4) 실제 refresh 요청 실행 (lock 설정)
  refreshPromise = (async () => {
    try {
      // 4-1) refresh API 호출 (ApiClient 사용)
      const data: RefreshResponse = await ApiClient.post("/api/auth/refresh", {
        refreshToken,
      });

      // 4-2) 새 accessToken이 없으면 실패 처리
      const newAccessToken = data?.accessToken ?? null;
      if (!newAccessToken) return null;

      // 4-3) 서버에서 refreshToken을 새로 내려주면 교체,
      //      없으면 기존 refreshToken 유지
      const newRefreshToken = data?.refreshToken ?? refreshToken;

      // 4-4) 토큰 저장소 갱신
      setTokens(newAccessToken, newRefreshToken);

      // 4-5) 새 accessToken 반환
      return newAccessToken;
    } catch {
      // HTTP 실패 또는 네트워크 오류 시 null
      return null;
    } finally {
      // 5) 성공/실패/예외와 관계없이
      //    다음 refresh 요청을 위해 lock 해제
      refreshPromise = null;
    }
  })();

  // 6) 현재 refresh 요청 Promise 반환
  return refreshPromise;
}
