import { refreshAccessToken } from "../../utils/tokenRefresh";
import { ApiClient } from "../apiConfig";
import type { GetArgs, PostArgs, PutArgs, DeleteArgs } from "../type";
import { requestWithAuth } from "./helpers";
import type {
  ApiPath,
  ApiRequest,
  ApiResponseSuccess,
} from "@/types/api/helpers";

/**
 * Authenticated API client
 * - request()(axios) 기반, 인증/401-refresh-재시도는 requestWithAuth에서 처리
 */
export const AuthenticatedApiClient = {
  config: ApiClient.config,

  /**
   * 수동 토큰 갱신이 필요할 때 사용.
   * - refreshToken이 없거나 refresh 실패 시 null 반환
   * - 성공 시 새 accessToken 반환(및 localStorage 갱신)
   */
  async refresh(): Promise<string | null> {
    return refreshAccessToken();
  },

  get<Path extends ApiPath>(
    endpoint: Path,
    args?: GetArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "get">> {
    return requestWithAuth<ApiResponseSuccess<Path, "get">>({
      method: "GET",
      endpoint: String(endpoint),
      pathParams: args?.pathParams,
      params: args?.query,
      headers: args?.headers,
    });
  },

  post<Path extends ApiPath>(
    endpoint: Path,
    data?: ApiRequest<Path, "post">,
    args?: PostArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "post">> {
    return requestWithAuth<ApiResponseSuccess<Path, "post">>({
      method: "POST",
      endpoint: String(endpoint),
      pathParams: args?.pathParams,
      headers: args?.headers,
      body: data,
    });
  },

  put<Path extends ApiPath>(
    endpoint: Path,
    data?: ApiRequest<Path, "put">,
    args?: PutArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "put">> {
    return requestWithAuth<ApiResponseSuccess<Path, "put">>({
      method: "PUT",
      endpoint: String(endpoint),
      pathParams: args?.pathParams,
      headers: args?.headers,
      body: data,
    });
  },

  delete<Path extends ApiPath>(
    endpoint: Path,
    args?: DeleteArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "delete">> {
    return requestWithAuth<ApiResponseSuccess<Path, "delete">>({
      method: "DELETE",
      endpoint: String(endpoint),
      pathParams: args?.pathParams,
      headers: args?.headers,
      body: args?.body,
    });
  },
};
