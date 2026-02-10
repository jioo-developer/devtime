import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig/apiConfig";
import { setTokens } from "@/config/utils/tokenStorage";
import { safeInternalPath } from "@/utils/pathUtils";
import type { LoginData, LoginResponse } from "../types";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginData) => {
      const payload = {
        email: data.email,
        password: data.password,
      };
      return ApiClient.post("/api/auth/login", payload);
    },
  });
};

export function createLoginSuccessHandler(
  router: { replace: (url: string) => void },
  searchParams: { get: (key: string) => string | null },
) {
  return (result: LoginResponse) => {
    if (result.success) {
      setTokens(result.accessToken, result.refreshToken);
      if (result.isFirstLogin) {
        router.replace("/profile");
      } else {
        const redirectParam = safeInternalPath(searchParams.get("redirect"));
        router.replace(redirectParam ?? "/");
      }
    }
  };
}
