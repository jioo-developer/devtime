import type { AxiosError } from "axios";
import type { NotOkResponse } from "./type";

type UnknownRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** NEXT_PUBLIC_API_BASE_URL 가져오기 (없으면 즉시 예외) */
export function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  return baseUrl;
}

/**
 * pathParams로 endpoint 템플릿 치환
 * 예: "/users/{id}" + { id: 3 } → "/users/3"
 */
export function substitutePathParams(
  endpoint: string,
  pathParams?: unknown,
): string {
  if (!isPlainObject(pathParams)) return endpoint;

  return Object.entries(pathParams).reduce((path, [key, value]) => {
    const token = `{${key}}`;
    const encoded = encodeURIComponent(String(value));
    return path.replaceAll(token, encoded);
  }, endpoint);
}

/** AxiosError → NotOkResponse 어댑터 */
export function toNotOkResponse(error: AxiosError): NotOkResponse {
  const response = error.response;

  return {
    status: response?.status ?? 0,
    statusText: response?.statusText,
    json: async () => response?.data ?? {},
  };
}
