"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/modalStore";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

export function ProfileRequiredGuard() {
  const hasShownModal = useRef(false);
  const router = useRouter();
  const { push: openModal, closeTop: closeModal } = useModalStore();

  useEffect(() => {
    if (hasShownModal.current) return;
    hasShownModal.current = true;

    openModal({
      title: "알림",
      content: "작성된 프로필이 없습니다. 프로필페이지로 이동하겠습니다.",
      footer: (
        <CommonButton
          theme="primary"
          onClick={() => {
            closeModal();
            router.replace("/profile");
          }}
        >
          확인
        </CommonButton>
      ),
      BackdropMiss: false,
    });
  }, [openModal, closeModal, router]);

  return null;
}
