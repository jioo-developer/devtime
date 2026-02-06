import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig/apiConfig";
import { useLogin } from "@/app/login/hooks/useLogin";
import type { LoginResponse } from "@/app/login/types";
import { setTokens } from "@/config/utils/tokenStorage";
import { useSignupModal } from "./useSignupModal";
import type { AuthFormData } from "../Client";

export const useSignup = () => {
  const { mutateAsync: loginAsync } = useLogin();
  const { showSignupSuccessModal, showSignupErrorModal } = useSignupModal();

  return useMutation({
    mutationFn: async (data: AuthFormData) => {
      const payload = {
        email: data.email,
        nickname: data.nickname,
        password: data.password,
        confirmPassword: data.passwordConfirmation,
      };

      // 1) 회원가입
      const signupRes = await ApiClient.post("/api/signup", payload);

      // 2) 자동 로그인
      const loginRes: LoginResponse = await loginAsync({
        email: data.email,
        password: data.password,
      });

      if (loginRes?.success) {
        setTokens(loginRes.accessToken, loginRes.refreshToken);
      }

      return signupRes;
    },
    onSuccess: showSignupSuccessModal,
    onError: showSignupErrorModal,
  });
};
