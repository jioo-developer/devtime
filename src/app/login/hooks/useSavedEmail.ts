import { useEffect, useState } from "react";

type SetEmailValue = (name: "email", value: string) => void;
const SAVED_EMAIL_KEY = "savedEmail";

export function useSavedEmail(setValue: SetEmailValue) {
  const [isChecked, setIsChecked] = useState(false);

  // 저장된 이메일 불러오기 + 체크박스 체크 상태 반영
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(SAVED_EMAIL_KEY);
    if (saved) {
      setValue("email", saved);
      setIsChecked(true);
    }
  }, [setValue]);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    if (!checked) {
      localStorage.removeItem(SAVED_EMAIL_KEY);
    }
  };

  // 체크박스 상태에 따라 이메일 저장/삭제
  const saveEmailIfChecked = (email: string) => {
    if (typeof window === "undefined") return;

    if (isChecked) {
      localStorage.setItem(SAVED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(SAVED_EMAIL_KEY);
    }
  };

  return { isChecked, handleCheckboxChange, saveEmailIfChecked };
}
