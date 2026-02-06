import { getAccessToken, clearTokens } from "../../utils/tokenStorage";
import {
  getAccessTokenOrThrow,
  isUnauthorizedError,
  redirectToLogin,
} from "../../utils/authRedirect";
import { refreshAccessToken } from "../../utils/tokenRefresh";
import { request } from "../apiConfig";
import type { NotOkResponse } from "../type";

export type RequestWithAuthOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  pathParams?: unknown;
  params?: unknown;
  headers?: HeadersInit;
  body?: unknown;
  retried?: boolean;
};

/**
 * 인증이 포함된 HTTP 요청
 * - 토큰 없으면 최초 요청 시 로그인 이동
 * - 401 시 refresh 후 1회 재시도, 실패 시 로그아웃
 */
export async function requestWithAuth<TResponse>(
  options: RequestWithAuthOptions,
): Promise<TResponse> {
  const { method, endpoint, retried } = options;
  const token = getRequestTokenOrRedirect(retried);

  return request<TResponse>({
    method,
    endpoint,
    pathParams: options.pathParams,
    params: options.params,
    headers: buildAuthHeaders(token, options.headers),
    data: options.body,
    onNotOk: async (response) => {
      if (response.status === 401) {
        if (retried) logoutAndRedirect();
        const newToken = await refreshAccessToken();
        if (!newToken) logoutAndRedirect();
        return requestWithAuth<TResponse>({ ...options, retried: true });
      }
      await throwMessageIfJson(response);
      throw new Error(`${method} ${endpoint} failed`);
    },
  });
}

function getRequestTokenOrRedirect(retried?: boolean): string | null {
  if (retried) return getAccessToken();
  try {
    return getAccessTokenOrThrow(getAccessToken);
  } catch (error) {
    if (isUnauthorizedError(error)) logoutAndRedirect();
    throw error;
  }
}

function buildAuthHeaders(
  token: string | null,
  extra?: HeadersInit,
): Record<string, string> {
  const headers: Record<string, string> = {};
  if (extra instanceof Headers) {
    extra.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (extra && typeof extra === "object" && !Array.isArray(extra)) {
    Object.entries(extra).forEach(([key, value]) => {
      headers[key] = String(value);
    });
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function logoutAndRedirect() {
  clearTokens();
  redirectToLogin();
  throw new Error("Unauthorized");
}

async function throwMessageIfJson(response: NotOkResponse): Promise<void> {
  const body = (await response.json()) as { message?: string };
  if (body?.message) throw new Error(body.message);
}
