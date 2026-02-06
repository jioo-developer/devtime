import { useModalStore } from "@/store/modalStore";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

export const useProfileModals = () => {
  const openModal = useModalStore((state) => state.push);
  const closeModal = useModalStore((state) => state.closeTop);

  const showValidationErrorModal = () => {
    openModal({
      title: "입력 오류",
      content: "모든 항목을 입력해 주세요.",
      footer: (
        <CommonButton theme="primary" onClick={() => closeModal()}>
          확인
        </CommonButton>
      ),
      BackdropMiss: false,
    });
  };

  const showCreateErrorModal = (errorMessage: string) => {
    openModal({
      title: "프로필 저장 실패",
      content: errorMessage,
      footer: (
        <CommonButton theme="primary" onClick={() => closeModal()}>
          확인
        </CommonButton>
      ),
      BackdropMiss: false,
    });
  };

  return { showValidationErrorModal, showCreateErrorModal };
};
