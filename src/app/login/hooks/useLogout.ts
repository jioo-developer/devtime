import { useMutation } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { clearTokens } from "@/config/utils/tokenStorage";
import type { ApiResponse } from "@/types/api/helpers";

/** POST /api/auth/logout 200 응답 (generated.ts 기반) */
export type LogoutResponse = ApiResponse<"/api/auth/logout", "post", 200>;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const redirectToLogin = () => {
    clearTokens();
    router.replace("/login");
  };

  return useMutation<LogoutResponse, Error, void>({
    mutationFn: () => AuthenticatedApiClient.post("/api/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      redirectToLogin();
    },
    onError: (error) => {
      console.error("로그아웃 오류:", error);
      redirectToLogin();
    },
  });
};
