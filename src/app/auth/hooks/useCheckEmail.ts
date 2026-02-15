import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig/apiConfig";
import type { ApiResponse } from "@/types/api/helpers";

/** GET /api/signup/check-email 200 응답 (generated.ts 기반) */
export type CheckEmailResponse = ApiResponse<
  "/api/signup/check-email",
  "get",
  200
>;

export const useCheckEmail = () => {
  return useMutation({
    mutationFn: (email: string) =>
      ApiClient.get("/api/signup/check-email", {
        query: { email },
      }) as Promise<CheckEmailResponse>,
  });
};
