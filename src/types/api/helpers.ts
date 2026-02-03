/**
 * OpenAPI paths 기반 요청/응답 타입 헬퍼
 * generated.ts와 함께 사용 — 경로+메서드만 맞으면 요청/응답 타입 자동 추론
 */
import type { paths } from "./generated";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export type ApiPath = keyof paths;

/** JSON 응답 타입 (200 등) */
export type ApiResponse<
  Path extends ApiPath,
  Method extends keyof paths[Path] & HttpMethod,
  Status extends number = 200,
> = paths[Path][Method] extends {
  responses: { [K in Status]: { content: { "application/json": infer T } } };
}
  ? T
  : never;

/** 2xx 응답 중 하나의 JSON 바디 (status 구분 없이 사용) */
export type ApiResponseSuccess<
  Path extends ApiPath,
  Method extends keyof paths[Path] & HttpMethod,
> = paths[Path][Method] extends { responses: infer R }
  ? R extends Record<number, { content?: { "application/json": infer T } }>
  ? T
  : never
  : never;

/** JSON 요청 바디 타입 (post/put 등, requestBody optional 대응) */
export type ApiRequest<
  Path extends ApiPath,
  Method extends keyof paths[Path] & HttpMethod,
> = paths[Path][Method] extends {
  requestBody?: { content: { "application/json": infer T } };
}
  ? T
  : never;

/** Query params 타입 (parameters.query optional 대응) */
export type ApiQueryParams<
  Path extends ApiPath,
  Method extends keyof paths[Path] & HttpMethod,
> = paths[Path][Method] extends { parameters?: { query?: infer T } }
  ? T
  : never;

/** Path params 타입 (parameters.path optional 대응) */
export type ApiPathParams<
  Path extends ApiPath,
  Method extends keyof paths[Path] & HttpMethod,
> = paths[Path][Method] extends { parameters?: { path?: infer T } } ? T : never;
