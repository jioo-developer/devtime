import type {
    ApiPath,
    ApiPathParams,
    ApiQueryParams,
    ApiRequest,
    ApiResponseSuccess,
} from "@/types/api/helpers";

export type GetArgs<Path extends ApiPath> = {
    query?: ApiQueryParams<Path, "get">;
    pathParams?: ApiPathParams<Path, "get">;
    headers?: HeadersInit;
    onNotOk?: (response: Response) => Promise<ApiResponseSuccess<Path, "get">>;
};

export type PostArgs<Path extends ApiPath> = {
    pathParams?: ApiPathParams<Path, "post">;
    headers?: HeadersInit;
    onNotOk?: (response: Response) => Promise<ApiResponseSuccess<Path, "post">>;
};

export type PutArgs<Path extends ApiPath> = {
    pathParams?: ApiPathParams<Path, "put">;
    headers?: HeadersInit;
    onNotOk?: (response: Response) => Promise<ApiResponseSuccess<Path, "put">>;
};

export type DeleteArgs<Path extends ApiPath> = {
    pathParams?: ApiPathParams<Path, "delete">;
    body?: ApiRequest<Path, "delete">;
    headers?: HeadersInit;
    onNotOk?: (response: Response) => Promise<ApiResponseSuccess<Path, "delete">>;
};

