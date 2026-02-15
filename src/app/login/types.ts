import type { ApiRequest, ApiResponse } from "@/types/api/helpers";

/** POST /api/auth/login 요청 (generated.ts 기반) */
export type LoginData = ApiRequest<"/api/auth/login", "post">;

/** POST /api/auth/login 200 응답 (generated.ts 기반) */
export type LoginResponse = ApiResponse<"/api/auth/login", "post", 200>;
