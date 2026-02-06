import type {
  ApiPath,
  ApiRequest,
  ApiResponseSuccess,
} from "@/types/api/helpers";
import type { GetArgs, PostArgs, PutArgs, DeleteArgs } from "./type";
import { requestJson } from "./helpers";

export const config: {
  timeout: number;
  headers: { [key: string]: string };
} = {
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const ApiClient = {
  config: {
    timeout: config.timeout,
    headers: config.headers,
  },

  get<Path extends ApiPath>(
    endpoint: Path,
    args?: GetArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "get">> {
    return requestJson<ApiResponseSuccess<Path, "get">>({
      method: "GET",
      endpoint: String(endpoint),
      baseHeaders: ApiClient.config.headers,
      pathParams: args?.pathParams,
      query: args?.query,
      headers: args?.headers,
      onNotOk: args?.onNotOk,
    });
  },

  post<Path extends ApiPath>(
    endpoint: Path,
    data?: ApiRequest<Path, "post">,
    args?: PostArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "post">> {
    return requestJson<ApiResponseSuccess<Path, "post">>({
      method: "POST",
      endpoint: String(endpoint),
      baseHeaders: ApiClient.config.headers,
      pathParams: args?.pathParams,
      headers: args?.headers,
      body: data,
      onNotOk: args?.onNotOk,
    });
  },

  put<Path extends ApiPath>(
    endpoint: Path,
    data?: ApiRequest<Path, "put">,
    args?: PutArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "put">> {
    return requestJson<ApiResponseSuccess<Path, "put">>({
      method: "PUT",
      endpoint: String(endpoint),
      baseHeaders: ApiClient.config.headers,
      pathParams: args?.pathParams,
      headers: args?.headers,
      body: data,
      onNotOk: args?.onNotOk,
    });
  },

  delete<Path extends ApiPath>(
    endpoint: Path,
    args?: DeleteArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "delete">> {
    return requestJson<ApiResponseSuccess<Path, "delete">>({
      method: "DELETE",
      endpoint: String(endpoint),
      baseHeaders: ApiClient.config.headers,
      pathParams: args?.pathParams,
      headers: args?.headers,
      body: args?.body,
      onNotOk: args?.onNotOk,
    });
  },

  /**
   * S3 presigned URL 업로드 전용.
   * baseUrl/Authorization 미사용 — presigned URL에 서명 포함.
   */
  async putBinary(
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
  },
};
