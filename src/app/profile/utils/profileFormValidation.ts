import { PURPOSE_OTHER_VALUE } from "@/app/mypage/constants";
import type { ProfileFormData } from "@/app/mypage/types";

export function isProfileFormIncomplete(data: ProfileFormData): boolean {
  const isBlank = (value?: string) => (value ?? "").trim() === "";
  const isEmptyList = (list?: unknown[]) =>
    !Array.isArray(list) || list.length === 0;

  const checks: boolean[] = [
    // 문자열 필수 입력값
    isBlank(data.career),
    isBlank(data.purpose),
    isBlank(data.goal),
    isBlank(data.profileImage),

    // 조건부 필드
    data.purpose === PURPOSE_OTHER_VALUE && isBlank(data.purposeDetail),

    // 컬렉션
    isEmptyList(data.techStacks),
  ];

  return checks.some(Boolean);
}
