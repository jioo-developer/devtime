import { useMutation } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { clearTokens } from "@/config/utils/tokenStorage";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const redirectToLogin = () => {
    clearTokens();
    router.replace("/login");
  };

  return useMutation({
    mutationFn: () => {
      return AuthenticatedApiClient.post("/api/auth/logout", undefined);
    },
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
