"use client";
import { useLoginRequiredModal } from "@/hooks/useIsLoggedIn";

/** 비로그인 시 "로그인 필요" 모달을 전역으로 처리. 레이아웃에서 한 번만 렌더링한다. */
export default function LoginGuard() {
  useLoginRequiredModal();
  return null;
}
