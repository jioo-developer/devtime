"use client";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { useModalStore } from "@/store/modalStore";
import { StudyLogDetailContent } from "../components/records/StudyLogDetailContent";
import { useDeleteStudyLog } from "../hooks/useDeleteStudyLog";

export function useStudyLogModals() {
  const openModal = useModalStore((state) => state.push);
  const closeModal = useModalStore((state) => state.closeTop);
  const { mutate: deleteStudyLog, isPending: isDeleting } = useDeleteStudyLog();

  const openDeleteConfirmModal = (studyLogId: string | number) => {
    openModal({
      title: "학습 기록 삭제",
      content: (
        <p className="studyLogModalConfirmText">
          정말 삭제할까요? 복구할 수 없습니다.
        </p>
      ),
      footer: (
        <div className="studyLogModalActions">
          <CommonButton theme="secondary" onClick={closeModal}>
            취소
          </CommonButton>
          <CommonButton
            theme="tertiary"
            className="studyLogModalDelete"
            disabled={isDeleting}
            onClick={() => {
              deleteStudyLog(studyLogId, { onSuccess: closeModal });
            }}
          >
            {isDeleting ? "삭제 중…" : "삭제"}
          </CommonButton>
        </div>
      ),
      width: 420,
      BackdropMiss: false,
      showCloseButton: true,
    });
  };

  const openStudyLogDetailModal = (studyLogId: string | number) => {
    const id = String(studyLogId);
    openModal({
      title: "학습 기록 상세",
      content: <StudyLogDetailContent studyLogId={id} />,
      footer: (
        <div className="studyLogModalActions">
          <CommonButton theme="secondary" onClick={closeModal}>
            닫기
          </CommonButton>
          <CommonButton
            theme="tertiary"
            className="studyLogModalDelete"
            onClick={() => {
              closeModal();
              openDeleteConfirmModal(studyLogId);
            }}
          >
            삭제하기
          </CommonButton>
        </div>
      ),
      width: 420,
      BackdropMiss: true,
      showCloseButton: true,
    });
  };

  return { openStudyLogDetailModal };
}
