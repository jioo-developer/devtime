"use client";
import React from "react";
import Link from "next/link";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import LogoBlue from "@/asset/images/logo_blue.svg";

export default function ResetPasswordSuccessView() {
  return (
    <>
      <CommonImage src={LogoBlue} alt="DevTime 로고" className="logo" />
      <div className="successMessage">
        <p className="successTitle">이메일을 확인해 주세요</p>
        <p className="successDescription">
          입력하신 이메일 주소로 비밀번호 재설정 링크를 보냈습니다.
          <br />
          이메일을 확인하여 비밀번호를 재설정해 주세요.
        </p>
      </div>
      <Link href="/login" className="goLoginLink">
        <CommonButton theme="primary" type="button" width="100%">
          로그인으로 돌아가기
        </CommonButton>
      </Link>
    </>
  );
}
