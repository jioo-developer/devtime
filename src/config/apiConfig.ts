import type {
  ApiPath,
  ApiPathParams,
  ApiQueryParams,
  ApiRequest,
  ApiResponseSuccess,
} from "@/types/api/helpers";

function buildQueryString(query?: Record<string, unknown>): string {
  if (!query || typeof query !== "object" || Object.keys(query).length === 0)
    return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    params.set(k, String(v));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function applyPathParams(
  path: string,
  pathParams?: Record<string, unknown>,
): string {
  if (!pathParams) return path;
  return Object.entries(pathParams).reduce(
    (acc, [k, v]) =>
      acc.replaceAll(`{${k}}`, encodeURIComponent(String(v))),
    path,
  );
}

const config = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  } as Record<string, string>,
};

type GetArgs<Path extends ApiPath> = {
  query?: ApiQueryParams<Path, "get">;
  pathParams?: ApiPathParams<Path, "get">;
  headers?: HeadersInit;
  onNotOk?: (response: Response) => Promise<ApiResponseSuccess<Path, "get">>;
};

type PostArgs<Path extends ApiPath> = {
  pathParams?: ApiPathParams<Path, "post">;
  headers?: HeadersInit;
  onNotOk?: (response: Response) => Promise<never>;
};

type PutArgs<Path extends ApiPath> = {
  pathParams?: ApiPathParams<Path, "put">;
  headers?: HeadersInit;
};

type DeleteArgs<Path extends ApiPath> = {
  pathParams?: ApiPathParams<Path, "delete">;
  body?: ApiRequest<Path, "delete">;
  headers?: HeadersInit;
};

export const ApiClient = {
  config: {
    baseUrl: config.baseUrl,
    timeout: config.timeout,
    headers: config.headers,
  },

  async get<Path extends ApiPath>(
    endpoint: Path,
    args?: GetArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "get">> {
    const baseUrl = this.config.baseUrl;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");

    const path = applyPathParams(String(endpoint), args?.pathParams as Record<string, unknown>);
    const url = `${baseUrl}${path}${buildQueryString(args?.query as Record<string, unknown>)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { ...this.config.headers, ...(args?.headers ?? {}) },
    });

    if (!response.ok) {
      if (args?.onNotOk) return args.onNotOk(response);
      throw new Error(`GET ${endpoint} failed`);
    }

    return response.json();
  },

  async post<Path extends ApiPath>(
    endpoint: Path,
    data?: ApiRequest<Path, "post">,
    args?: PostArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "post">> {
    const baseUrl = this.config.baseUrl;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");

    const path = applyPathParams(String(endpoint), args?.pathParams as Record<string, unknown>);
    const url = `${baseUrl}${path}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { ...this.config.headers, ...(args?.headers ?? {}) },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      if (args?.onNotOk) return args.onNotOk(response);
      throw new Error(`POST ${endpoint} failed`);
    }

    return response.json();
  },

  async put<Path extends ApiPath>(
    endpoint: Path,
    data?: ApiRequest<Path, "put">,
    args?: PutArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "put">> {
    const baseUrl = this.config.baseUrl;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");

    const path = applyPathParams(String(endpoint), args?.pathParams as Record<string, unknown>);
    const url = `${baseUrl}${path}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { ...this.config.headers, ...(args?.headers ?? {}) },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) throw new Error(`PUT ${endpoint} failed`);

    return response.json();
  },

  async delete<Path extends ApiPath>(
    endpoint: Path,
    args?: DeleteArgs<Path>,
  ): Promise<ApiResponseSuccess<Path, "delete">> {
    const baseUrl = this.config.baseUrl;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");

    const path = applyPathParams(String(endpoint), args?.pathParams as Record<string, unknown>);
    const url = `${baseUrl}${path}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: { ...this.config.headers, ...(args?.headers ?? {}) },
      body: args?.body ? JSON.stringify(args.body) : undefined,
    });

    if (!response.ok) throw new Error(`DELETE ${endpoint} failed`);

    return response.json();
  },
};
