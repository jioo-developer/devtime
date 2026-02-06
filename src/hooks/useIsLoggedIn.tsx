"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/config/utils/tokenStorage";
import { useModalStore } from "@/store/modalStore";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

/** 로그인 여부: accessToken 존재로 판단. isReady는 클라이언트에서 1회 확인 후 true */
export function useIsLoggedIn(): { isLoggedIn: boolean; isReady: boolean } {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getAccessToken()));
    setIsReady(true);
  }, []);

  return { isLoggedIn, isReady };
}

/** 비로그인일 때 "로그인 필요" 모달을 띄운다. isReady 이후에만 검사 */
export function useLoginRequiredModal(isLoggedIn: boolean, isReady: boolean) {
  const router = useRouter();
  const openModal = useModalStore((state) => state.push);
  const closeTop = useModalStore((state) => state.closeTop);

  useEffect(() => {
    if (!isReady || isLoggedIn) return;

    openModal({
      width: 360,
      height: 150,
      title: "로그인 필요",
      content: "로그인이 필요한 서비스입니다.",
      showCloseButton: false,
      BackdropMiss: true,
      footer: (
        <CommonButton
          theme="primary"
          onClick={() => {
            closeTop();
            router.push("/login");
          }}
        >
          로그인 하러가기
        </CommonButton>
      ),
    });
  }, [isReady, isLoggedIn, openModal, closeTop, router]);
}
