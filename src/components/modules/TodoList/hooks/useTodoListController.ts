import { useEffect, useState } from "react";
import { useEdit } from "./useEdit";

/**
 * 도메인 상태 (비즈니스 의미)
 * - active    : 진행 중
 * - completed : 완료
 * - default   : 초기 상태
 * - disabled  : 비활성
 */
export type TodoStatus = "active" | "completed" | "default" | "disabled";

/**
 * UI 전용 상태
 * - 도메인 상태 + 화면 표현을 위한 상태
 * - typing : 편집 중
 * - empty  : 내용이 비어 있음
 */
export type TodoUiStatus = TodoStatus | "typing" | "empty";

export interface UseTodoListItemControllerParams {
  text: string;
  initialStatus?: TodoStatus;

  // 부모와 통신용 콜백
  onTextChange?: (nextText: string) => void;
  onStatusChange?: (nextStatus: TodoStatus) => void;
  onDelete?: () => void;
}

export function useTodoListItemController({
  text,
  initialStatus = "default",
  onTextChange,
  onStatusChange,
  onDelete,
}: UseTodoListItemControllerParams) {
  const [status, setStatus] = useState<TodoStatus>(initialStatus);

  // initialStatus가 변경되면 status를 업데이트
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  // status를 업데이트하고 onStatusChange를 호출
  const setStatusAndNotify = (next: TodoStatus) => {
    setStatus(next);
    onStatusChange?.(next);
  };

  const isDisabled = status === "disabled";

  // 공백 제거 후 부모에 전달하고 값이 있으면 active 상태로 전환
  const commitTextToParent = (raw: string) => {
    const committed = raw.trim();

    onTextChange?.(committed);

    if (committed) {
      setStatusAndNotify("active");
    }
  };

  // useEdit를 사용하여 인라인 편집을 관리
  const inlineEdit = useEdit({
    value: text,
    disabled: isDisabled,
    onCommit: commitTextToParent,
  });

  // UI 상태를 계산
  const isTyping = inlineEdit.isEditing;
  const hasNoContent = !inlineEdit.draftText.trim();

  // UI 상태를 계산
  const uiStatus: TodoUiStatus = isTyping
    ? "typing"
    : hasNoContent
      ? "empty"
      : status;

  // 아이템 클릭 시 완료/진행 토글
  const handleItemClick = () => {
    setStatusAndNotify(status === "completed" ? "active" : "completed");
  };

  // 편집 시작 / 종료 / 취소
  const startEdit = () => inlineEdit.start();
  const finishEdit = () => inlineEdit.commit();
  const cancelEdit = () => inlineEdit.cancel();

  // 비활성 토글
  const toggleDisabled = () => {
    setStatusAndNotify(isDisabled ? "active" : "disabled");
  };

  // 삭제 요청
  const requestDelete = () => onDelete?.();

  // 폼에서 넘긴 값으로 커밋 후 편집 모드만 종료
  const finishEditWithValue = (value: string) => {
    commitTextToParent(value);
    inlineEdit.stop();
  };

  return {
    state: {
      uiStatus,
      text: inlineEdit.draftText,
      isDisabled,
      isTyping: uiStatus === "typing",
      isEmpty: uiStatus === "empty",
    },

    actions: {
      setText: inlineEdit.setDraftText,
      onItemClick: handleItemClick,
      startEdit,
      finishEdit,
      cancelEdit,
      toggleDisabled,
      requestDelete,
      finishEditWithValue,
    },
  };
}
