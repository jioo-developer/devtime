"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonCheckbox from "@/components/atoms/CommonCheckbox/CommonCheckbox";
import LoginBgImage from "@/asset/images/login-background-image.png";
import LogoBlue from "@/asset/images/logo_blue.svg";
import { useLogin } from "./hooks/useLogin";
import { useSavedEmail } from "./hooks/useSavedEmail";
import { redirectAlreadyLoggedIn } from "@/config/utils/authRedirect";
import { setTokens } from "@/config/utils/tokenStorage";
import { safeInternalPath } from "@/utils/pathUtils";
import type { LoginData, LoginResponse } from "./types";
import Link from "next/link";
import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN } from "@/constant/password";
import "./style.css";

function Client() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<LoginData>({
    mode: "onChange",
  });

  const { email, password } = watch();

  // 이메일 저장 체크박스 상태 관리
  const { isChecked, handleCheckboxChange, saveEmailIfChecked } =
    useSavedEmail(setValue);

  const { mutate: login } = useLogin();

  // 폼 유효성 검사
  const isFormValid =
    !!email && !!password && !errors.email && !errors.password;

  const onSubmit = async (data: LoginData) => {
    if (isFormValid) {
      saveEmailIfChecked(data.email);
      login(data, {
        onSuccess: (result: LoginResponse) => {
          if (!result.success) {
            throw new Error(result.message ?? "로그인에 실패했습니다.");
          }
          // 로그인 관련 토큰 저장 (accessToken, refreshToken)
          setTokens(result.accessToken, result.refreshToken);
          // 첫 로그인 여부에 따라 프로필 페이지 또는 리다이렉트
          if (result.isFirstLogin) {
            router.replace("/profile");
          } else {
            const redirectParam = safeInternalPath(
              searchParams.get("redirect"),
            );
            router.replace(redirectParam ?? "/");
          }
        },
        onError: (error) => {
          console.error("로그인 실패:", error);
        },
      });
    } else {
      await trigger(["email", "password"]);
    }
  };

  // 이미 로그인된 경우 로그인 페이지에서 나가기
  if (redirectAlreadyLoggedIn(searchParams.get("redirect"))) return null;

  return (
    <main className="loginLayout">
      <CommonImage
        src={LoginBgImage}
        alt="로그인 백그라운드 이미지"
        className="backgroundImage"
        width={800}
      />
      <div className="loginWrap">
        <div className="loginContent">
          <CommonImage src={LogoBlue} alt="DevTime 로고" className="logo" />

          <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
            <CommonInput
              id="email"
              testId="email-input"
              label="아이디"
              type="email"
              autoComplete="email"
              placeholder="이메일 주소를 입력해 주세요."
              register={register}
              validation={{
                required: "이메일을 입력하세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "이메일 형식으로 작성해 주세요.",
                },
              }}
              error={errors.email}
            />
            <div className="saveEmailCheckboxWrap">
              <CommonCheckbox
                id="save-email-checkbox"
                size={18}
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(e.target.checked)}
                testId="save-email-checkbox"
              />
              <label htmlFor="save-email-checkbox">아이디 저장</label>
            </div>
            <CommonInput
              id="password"
              testId="password-input"
              label="비밀번호"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력해 주세요."
              register={register}
              validation={{
                required: "비밀번호를 입력하세요.",
                minLength: {
                  value: PASSWORD_MIN_LENGTH,
                  message: `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
                },
                pattern: {
                  value: PASSWORD_PATTERN,
                  message: "비밀번호는 영문과 숫자 조합이어야 합니다.",
                },
              }}
              error={errors.password}
            />
            <CommonButton
              theme={isFormValid ? "primary" : "disable"}
              type="submit"
              width="100%"
              style={{ marginTop: 42 }}
              disabled={!isFormValid}
            >
              로그인
            </CommonButton>
          </form>

          <Link href="/auth">
            <CommonButton theme="none" className="goSignup">
              <span>회원가입</span>
            </CommonButton>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Client;
