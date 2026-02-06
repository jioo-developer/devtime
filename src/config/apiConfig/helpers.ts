import { AxiosError } from "axios";
import { NotOkResponse } from "./type";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// 기본 URL 가져오기
export function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  return baseUrl;
}

/** pathParams로 endpoint 템플릿 치환. 예: "/users/{id}" + { id: 3 } → "/users/3" */
export function substitutePathParams(
  endpoint: string,
  pathParams?: unknown,
): string {
  if (!isRecord(pathParams)) return endpoint;
  let path = endpoint;
  for (const [key, value] of Object.entries(pathParams)) {
    path = path.replaceAll(`{${key}}`, encodeURIComponent(String(value)));
  }
  return path;
}

// AxiosError를 NotOkResponse로 변환
export function toNotOkResponse(err: AxiosError): NotOkResponse {
  const status = err.response?.status ?? 0;
  const data = err.response?.data;
  return {
    status,
    json: () => Promise.resolve(data ?? {}),
  };
}
