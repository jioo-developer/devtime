import { getAccessToken, clearTokens } from "../../utils/tokenStorage";
import {
  getAccessTokenOrThrow,
  isUnauthorizedError,
  redirectToLogin,
} from "../../utils/authRedirect";
import { refreshAccessToken } from "../../utils/tokenRefresh";
import { parseJson, requestJson } from "../helpers";
import { ApiClient } from "../apiConfig";

// 인증된 요청 옵션 타입
export type RequestWithAuthOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  pathParams?: unknown;
  query?: unknown;
  headers?: HeadersInit;
  body?: unknown;
  retried?: boolean; // 내부 플래그: 401 재시도 여부
};

/**
 * 인증이 포함된 HTTP 요청 처리 함수
 * - 최초 요청에서는 토큰이 없으면 네트워크 요청 없이 즉시 로그인 이동
 * - 재시도 요청에서는 저장된 토큰을 그대로 사용
 * - 401 발생 시 토큰 갱신 후 1회 재시도
 * - 재시도 후에도 실패하면 로그아웃 처리
 */
export async function requestWithAuth<TResponse>(
  options: RequestWithAuthOptions,
): Promise<TResponse> {
  const { method, endpoint, retried } = options;

  // 1) 최초 요청에서는 토큰이 없으면 네트워크 요청 없이 즉시 로그인 이동
  const token = getRequestTokenOrRedirect(retried);

  // 2) 실제 API 요청 실행
  return requestJson<TResponse>({
    method,
    endpoint,
    baseHeaders: ApiClient.config.headers,
    pathParams: options.pathParams,
    query: options.query,
    headers: buildAuthHeaders(token, options.headers),
    body: options.body,

    onNotOk: async (response) => {
      // 3) 401이면 refresh 후 1회 재시도
      if (response.status === 401) {
        if (retried) logoutAndRedirect();

        const newToken = await refreshAccessToken();
        if (!newToken) logoutAndRedirect();

        return requestWithAuth<TResponse>({ ...options, retried: true });
      }

      // 4) 그 외 에러는 JSON message 우선, 없으면 기본 메시지
      await throwMessageIfJson(response);
      throw new Error(`${method} ${endpoint} failed`);
    },
  });
}

/* ───────────────────────────── helpers ───────────────────────────── */

/**
 * 요청에 사용할 토큰 결정
 * - 최초 요청: 토큰 없으면 즉시 로그아웃 처리 + 로그인 이동
 * - 재시도 요청: 저장된 토큰을 그대로 사용
 */
function getRequestTokenOrRedirect(retried?: boolean): string | null {
  if (retried) {
    return getAccessToken();
  }

  try {
    return getAccessTokenOrThrow(getAccessToken);
  } catch (error) {
    if (isUnauthorizedError(error)) logoutAndRedirect();
    throw error;
  }
}

/**
 * Authorization 헤더 포함
 * - 기존 헤더 유지 + Bearer 토큰 추가
 */
function buildAuthHeaders(token: string | null, extra?: HeadersInit): HeadersInit {
  const headers = new Headers(extra);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

/**
 * 인증 실패 공통 처리
 * - 토큰 삭제 → 로그인 페이지로 이동 → 이후 실행 차단(throw)
 */
function logoutAndRedirect() {
  clearTokens();
  redirectToLogin();
  throw new Error("Unauthorized");
}

/**
 * 에러 응답이 JSON이고 message가 있으면 그 메시지를 throw
 */
async function throwMessageIfJson(response: Response): Promise<void> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return;

  const body = await parseJson<{ message?: string }>(response);
  if (body?.message) throw new Error(body.message);
}
