"use client";
import React, { useState } from "react";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import ResetPasswordFormView from "./components/ResetPasswordFormView";
import ResetPasswordSuccessView from "./components/ResetPasswordSuccessView";
import LoginBgImage from "@/asset/images/login-background-image.png";
import "./style.css";

export interface ResetPasswordFormData {
  email: string;
}

function Client() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data: ResetPasswordFormData) => {
    // TODO: 비밀번호 재설정 이메일 발송 API 연동
    console.log("비밀번호 재설정 요청:", data.email);
    setIsSubmitted(true);
  };

  return (
    <main className="resetPasswordLayout">
      <CommonImage
        src={LoginBgImage}
        alt="비밀번호 찾기 백그라운드 이미지"
        className="backgroundImage"
        width={800}
      />
      <div className="resetPasswordWrap">
        <div className="resetPasswordContent">
          {isSubmitted ? (
            <div className="successContent">
              <ResetPasswordSuccessView />
            </div>
          ) : (
            <ResetPasswordFormView onSubmit={onSubmit} />
          )}
        </div>
      </div>
    </main>
  );
}

export default Client;
