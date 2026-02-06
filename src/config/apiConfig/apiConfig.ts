import axios, { type AxiosRequestConfig } from "axios";
import type {
  ApiPath,
  ApiRequest,
  ApiResponseSuccess,
} from "@/types/api/helpers";
import type {
  GetArgs,
  PostArgs,
  PutArgs,
  DeleteArgs,
  RequestConfig,
} from "./type";
import { getBaseUrl, substitutePathParams, toNotOkResponse } from "./helpers";

export const config = {
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: config.timeout,
  headers: config.headers,
});

export async function request<T>(requestConfig: RequestConfig<T>): Promise<T> {
  const url = substitutePathParams(
    requestConfig.endpoint,
    requestConfig.pathParams,
  );
  const axiosConfig: AxiosRequestConfig = {
    method: requestConfig.method,
    url,
    params: requestConfig.params,
    data: requestConfig.data,
    headers: requestConfig.headers as Record<string, string>,
  };

  try {
    const response = await axiosInstance.request(axiosConfig);
    return (
      response.data === "" || response.data == null ? {} : response.data
    ) as T;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response != null &&
      requestConfig.onNotOk
    ) {
      return requestConfig.onNotOk(toNotOkResponse(error));
    }
    throw error;
  }
}

export const ApiClient = {
  config: { timeout: config.timeout, headers: config.headers },

  get<Path extends ApiPath>(
    endpoint: Path,
    args?: GetArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "get">> {
    return request<ApiResponseSuccess<Path, "get">>({
      method: "GET",
      endpoint: String(endpoint),
      pathParams: args?.pathParams,
      params: args?.query,
      headers: args?.headers,
      onNotOk: args?.onNotOk,
    });
  },

  post<Path extends ApiPath>(
    endpoint: Path,
    data?: ApiRequest<Path, "post">,
    args?: PostArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "post">> {
    return request<ApiResponseSuccess<Path, "post">>({
      method: "POST",
      endpoint: String(endpoint),
      pathParams: args?.pathParams,
      data,
      headers: args?.headers,
      onNotOk: args?.onNotOk,
    });
  },

  put<Path extends ApiPath>(
    endpoint: Path,
    data?: ApiRequest<Path, "put">,
    args?: PutArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "put">> {
    return request<ApiResponseSuccess<Path, "put">>({
      method: "PUT",
      endpoint: String(endpoint),
      pathParams: args?.pathParams,
      data,
      headers: args?.headers,
      onNotOk: args?.onNotOk,
    });
  },

  delete<Path extends ApiPath>(
    endpoint: Path,
    args?: DeleteArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "delete">> {
    return request<ApiResponseSuccess<Path, "delete">>({
      method: "DELETE",
      endpoint: String(endpoint),
      pathParams: args?.pathParams,
      data: args?.body,
      headers: args?.headers,
      onNotOk: args?.onNotOk,
    });
  },

  /** S3 presigned URL 업로드 전용. baseURL/Authorization 미사용. */
  async putBinary(
    url: string,
    body: Blob | File,
    contentType: string,
  ): Promise<void> {
    try {
      await axios.put(url, body, {
        headers: { "Content-Type": contentType },
      });
    } catch {
      throw new Error("업로드에 실패했습니다.");
    }
  },
};
