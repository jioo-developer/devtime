import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig/apiConfig";
import type { ApiResponse } from "@/types/api/helpers";

/** GET /api/signup/check-nickname 200 응답 (generated.ts 기반) */
export type CheckNicknameResponse = ApiResponse<
  "/api/signup/check-nickname",
  "get",
  200
>;

export const useCheckNickname = () => {
  return useMutation({
    mutationFn: (nickname: string) =>
      ApiClient.get("/api/signup/check-nickname", {
        query: { nickname },
      }) as Promise<CheckNicknameResponse>,
  });
};
