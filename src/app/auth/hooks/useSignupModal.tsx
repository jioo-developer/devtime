import { useRouter } from "next/navigation";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { useModalStore } from "@/store/modalStore";

export const useSignupModal = () => {
  const router = useRouter();
  const openModal = useModalStore((state) => state.push);
  const closeModal = useModalStore((state) => state.closeTop);

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

  return { showSignupSuccessModal, showSignupErrorModal };
};
