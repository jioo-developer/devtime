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
};
