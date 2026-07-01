import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig/apiConfig";

import type { ApiRequest, ApiResponseSuccess } from "@/types/api/helpers";

/** POST /api/auth/login 요청 (generated.ts 기반) */
export type LoginData = ApiRequest<"/api/auth/login", "post">;

/** POST /api/auth/login 2xx 응답 (generated.ts 기반) */
export type LoginResponse = ApiResponseSuccess<"/api/auth/login", "post">;

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginData>({
    mutationFn: (data: LoginData) => ApiClient.post("/api/auth/login", data),
  });
};
