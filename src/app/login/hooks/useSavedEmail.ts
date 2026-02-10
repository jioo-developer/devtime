import { useEffect, useRef } from "react";

type SetEmailValue = (name: "email", value: string) => void;
const SAVED_EMAIL_KEY = "savedEmail";

export function useSavedEmail(setValue: SetEmailValue) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  // 저장된 이메일 불러오기
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(SAVED_EMAIL_KEY);
    if (saved) {
      setValue("email", saved);
      if (checkboxRef.current) {
        checkboxRef.current.checked = true;
      }
    }
  }, [setValue]);

  // 체크박스 상태에 따라 이메일 저장/삭제
  const saveEmailIfChecked = (email: string) => {
    if (typeof window === "undefined") return;

    if (checkboxRef.current?.checked) {
      localStorage.setItem(SAVED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(SAVED_EMAIL_KEY);
    }
  };

  return { checkboxRef, saveEmailIfChecked };
}
