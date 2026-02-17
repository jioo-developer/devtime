"use client";
import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import LogoBlue from "@/asset/images/logo_blue.svg";
import { ResetPasswordFormData } from "../Client";

type ResetPasswordFormViewProps = {
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
};

export default function ResetPasswordFormView({
  onSubmit,
}: ResetPasswordFormViewProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({ mode: "onChange" });

  const email = watch("email");
  const isFormValid = !!email && !errors.email;

  return (
    <>
      <CommonImage src={LogoBlue} alt="DevTime 로고" className="logo" />
      <h2 className="pageTitle">비밀번호 찾기</h2>
      <p className="pageDescription">
        가입 시 사용한 이메일 주소를 입력하시면
        <br />
        비밀번호 재설정 링크를 보내드립니다.
      </p>
      <form className="resetPasswordForm" onSubmit={handleSubmit(onSubmit)}>
        <CommonInput
          id="email"
          testId="reset-password-email-input"
          label="이메일"
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
        <CommonButton
          theme={isFormValid ? "primary" : "disable"}
          type="submit"
          width="100%"
          style={{ marginTop: 42 }}
          disabled={!isFormValid}
        >
          재설정 링크 받기
        </CommonButton>
      </form>
      <Link href="/login">
        <CommonButton theme="none" className="goLogin">
          <span>로그인으로 돌아가기</span>
        </CommonButton>
      </Link>
    </>
  );
}
