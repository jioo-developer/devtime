import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { ApiClient } from "@/config/apiConfig/apiConfig";
import { LoginResponse, useLogin } from "@/app/login/hooks/useLogin";
import { setTokens } from "@/config/utils/tokenStorage";
import { useModalStore } from "@/store/modalStore";
import type { ApiRequest, ApiResponse } from "@/types/api/helpers";
import { AuthFormData } from "../type/type";

export type SignupResponse = ApiResponse<"/api/signup", "post", 201>;

export const useSignup = () => {
  const router = useRouter();
  const openModal = useModalStore((state) => state.push);
  const closeModal = useModalStore((state) => state.closeTop);
  const { mutateAsync: loginAsync } = useLogin();

  const showSignupSuccessModal = () => {
    openModal({
      title: "회원가입 성공",
      content: "회원가입이 완료되었습니다.",
      footer: (
        <CommonButton
          theme="primary"
          onClick={() => {
            closeModal();
            router.push("/profile");
          }}
        >
          확인
        </CommonButton>
      ),
      BackdropMiss: false,
    });
  };

  const showSignupErrorModal = (error: Error | unknown) => {
    openModal({
      title: "회원가입 실패",
      content: (error as Error).message,
      footer: (
        <CommonButton theme="primary" onClick={() => closeModal()}>
          확인
        </CommonButton>
      ),
      BackdropMiss: false,
    });
  };

  return useMutation({
    mutationFn: async (data: AuthFormData) => {
      const payload: ApiRequest<"/api/signup", "post"> = {
        email: data.email,
        nickname: data.nickname,
        password: data.password,
        confirmPassword: data.passwordConfirmation,
      };

      // 1) 회원가입
      const signupRes: SignupResponse = await ApiClient.post(
        "/api/signup",
        payload,
      );

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
