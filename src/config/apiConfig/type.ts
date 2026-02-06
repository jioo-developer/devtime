import type {
  ApiPath,
  ApiPathParams,
  ApiQueryParams,
  ApiRequest,
  ApiResponseSuccess,
} from "@/types/api/helpers";

// request() 요청 설정
export type RequestConfig<T = unknown> = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  pathParams?: unknown;
  params?: unknown;
  data?: unknown;
  headers?: HeadersInit;
  onNotOk?: (response: NotOkResponse) => Promise<T>;
};

/** axios 4xx/5xx 시 request()에서 onNotOk에 넘기는 객체 (fetch Response 대체) */
export type NotOkResponse = {
  status: number;
  json(): Promise<unknown>;
};

export type GetArgs<Path extends ApiPath> = {
  query?: ApiQueryParams<Path, "get">;
  pathParams?: ApiPathParams<Path, "get">;
  headers?: HeadersInit;
  onNotOk?: (
    response: NotOkResponse,
  ) => Promise<ApiResponseSuccess<Path, "get">>;
};

export type PostArgs<Path extends ApiPath> = {
  pathParams?: ApiPathParams<Path, "post">;
  headers?: HeadersInit;
  onNotOk?: (
    response: NotOkResponse,
  ) => Promise<ApiResponseSuccess<Path, "post">>;
};

export type PutArgs<Path extends ApiPath> = {
  pathParams?: ApiPathParams<Path, "put">;
  headers?: HeadersInit;
  onNotOk?: (
    response: NotOkResponse,
  ) => Promise<ApiResponseSuccess<Path, "put">>;
};

export type DeleteArgs<Path extends ApiPath> = {
  pathParams?: ApiPathParams<Path, "delete">;
  body?: ApiRequest<Path, "delete">;
  headers?: HeadersInit;
  onNotOk?: (
    response: NotOkResponse,
  ) => Promise<ApiResponseSuccess<Path, "delete">>;
};
