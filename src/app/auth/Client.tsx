"use client";
import React, { useState } from "react";
import Link from "next/link";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import Logo from "@/asset/images/Logo.svg";
import Background from "@/asset/images/logo_background.jpg";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import AgreementList from "./component/AgreementList";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import { useForm } from "react-hook-form";
import { useCheckEmail, type CheckEmailResponse } from "./hooks/useCheckEmail";
import {
  useCheckNickname,
  type CheckNicknameResponse,
} from "./hooks/useCheckNickname";
import { useSignup } from "./hooks/useSignup";
import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN } from "@/constant/password";
import { isAuthFormValid } from "./utils/validation";
import "./style.css";

export type AuthFormData = {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
  /** 중복 확인 성공 메시지 (react-hook-form 상태로 관리) */
  emailVerified?: string;
  nicknameVerified?: string;
};
interface AuthPageProps {
  // 테스트 코드용 속성
  onSubmit?: (data: AuthFormData) => Promise<void>;
}

const AUTH_DEFAULT_VALUES: AuthFormData = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirmation: "",
  emailVerified: "",
  nicknameVerified: "",
};

function AuthPage({ onSubmit }: AuthPageProps = {}) {
  // 테스트 코드용 속성
  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    mode: "onChange",
    defaultValues: AUTH_DEFAULT_VALUES,
  });

  // 개인정보 동의 여부
  const [agreed, setAgreed] = useState(false);

  // 중복 확인 성공 메시지
  const emailVerified = watch("emailVerified") ?? "";
  const nicknameVerified = watch("nicknameVerified") ?? "";

  // 폼 유효성 검사
  const isFormValid = isAuthFormValid({
    watch,
    agreed,
    errors,
  });

  const { mutate: checkEmail } = useCheckEmail();
  const { mutate: checkNickname } = useCheckNickname();

  const handleCheckEmail = () => {
    const emailValue = watch("email");
    if (!emailValue) return;
    setValue("emailVerified", "");
    checkEmail(emailValue, {
      onSuccess: (data: CheckEmailResponse) => {
        if (!data.available) {
          setError("email", { type: "manual", message: data.message });
        } else {
          clearErrors("email");
          setValue("emailVerified", "사용 가능한 이메일입니다.");
        }
      },
      onError: () => {
        setError("email", {
          type: "manual",
          message: "이메일 중복 체크에 실패했습니다.",
        });
      },
    });
  };

  const handleCheckNickname = () => {
    const nicknameValue = watch("nickname");
    if (!nicknameValue) return;
    setValue("nicknameVerified", "");
    checkNickname(nicknameValue, {
      onSuccess: (data: CheckNicknameResponse) => {
        if (!data.available) {
          setError("nickname", {
            type: "manual",
            message: data.message || "이미 사용 중인 닉네임입니다.",
          });
        } else {
          clearErrors("nickname");
          setValue("nicknameVerified", "사용 가능한 닉네임입니다.");
        }
      },
      onError: () => {
        setError("nickname", {
          type: "manual",
          message: "닉네임 중복 체크에 실패했습니다.",
        });
      },
    });
  };

  // 회원가입 mutate
  const { mutate } = useSignup();

  // 회원가입 서브밋 핸들러
  const handleFormSubmit = async (data: AuthFormData) => {
    if (onSubmit) {
      // 테스트 코드용 if문
      await onSubmit(data);
    } else {
      mutate(data);
    }
  };

  return (
    <main className="authLayout">
      <section className="section logoSection">
        <CommonImage
          src={Background}
          alt="서비스 로고 백그라운드"
          fill
          className="background"
        />
        <div className="content">
          <CommonImage
            src={Logo}
            alt="서비스 로고"
            width={264}
            height={200}
            className="logo"
          />
          <p className="contentText">개발자를 위한 타이머</p>
        </div>
      </section>

      <section className="section formSection">
        <h2 className="formTitle">회원가입</h2>
        <form
          className="authForm"
          data-testid="auth-form-test"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="filedWrap">
            <CommonInput
              id="email"
              testId="email-input"
              label="아이디"
              type="text"
              placeholder="아이디를 입력하세요"
              register={register}
              validation={{
                required: "이메일을 입력하세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "이메일 형식으로 작성해 주세요.",
                },
              }}
              error={errors.email}
              success={emailVerified}
            />
            <CommonButton
              type="button"
              theme="overlap"
              width={104.6}
              height={44}
              onClick={handleCheckEmail}
            >
              중복 확인
            </CommonButton>
          </div>
          <div className="filedWrap">
            <CommonInput
              id="nickname"
              testId="nickname-input"
              label="닉네임"
              placeholder="닉네임을 입력해주세요"
              register={register}
              validation={{
                required: "닉네임을 입력하세요.",
              }}
              error={errors.nickname}
              success={nicknameVerified}
            />
            <CommonButton
              type="button"
              theme="overlap"
              width={104.6}
              height={44}
              onClick={handleCheckNickname}
            >
              중복 확인
            </CommonButton>
          </div>
          <CommonInput
            id="password"
            testId="password-input"
            label="비밀번호"
            type="password"
            placeholder={`비밀번호를 ${PASSWORD_MIN_LENGTH}자리 이상 입력하세요`}
            register={register}
            validation={{
              required: "비밀번호를 입력하세요.",
              minLength: {
                value: PASSWORD_MIN_LENGTH,
                message: `비밀번호는 ${PASSWORD_MIN_LENGTH}자리 이상이어야 합니다.`,
              },
              pattern: {
                value: PASSWORD_PATTERN,
                message: "비밀번호는 영문과 숫자를 포함해야 합니다.",
              },
            }}
            error={errors.password}
          />
          <CommonInput
            id="passwordConfirmation"
            testId="password-confirmation-input"
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요."
            register={register}
            validation={{
              required: "비밀번호를 다시 입력해 주세요.",
              validate: (value: string | undefined) =>
                value === watch("password") || "비밀번호가 일치하지 않습니다.",
            }}
            error={errors.passwordConfirmation}
          />
          <AgreementList agreed={agreed} setAgreed={setAgreed} />
          <CommonButton
            theme={isFormValid ? "primary" : "disable"}
            type="submit"
            width={"100%"}
            disabled={!isFormValid}
          >
            회원가입
          </CommonButton>
        </form>
        <div className="goLogin">
          <p>
            회원이신가요?
            <Link href="/login">
              <span>로그인 바로가기</span>
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
