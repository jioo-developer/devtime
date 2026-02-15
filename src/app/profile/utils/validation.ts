import { PURPOSE_OTHER_VALUE } from "@/app/profile/constants/constants";
import type { ProfileFormData } from "@/app/profile/types";

export function isProfileFormIncomplete(data: ProfileFormData): boolean {
  const isBlank = (value?: string) => (value ?? "").trim() === "";
  const isEmptyList = (list?: unknown[]) =>
    !Array.isArray(list) || list.length === 0;

  const checks: boolean[] = [
    // 개발 경력 비어있는지 검증
    isBlank(data.career),
    // 공부 목적 비어있는지 검증
    isBlank(data.purpose),
    // 공부 목적 상세 입력값 비어있는지 검증
    data.purpose === PURPOSE_OTHER_VALUE && isBlank(data.purposeDetail),
    // 공부 목적 상세 입력값 비어있는지 검증
    isBlank(data.goal),
    // 프로필 이미지 비어있는지 검증
    isBlank(data.profileImage),

    // 기타 목적 상세 입력값 비어있는지 검증
    data.purpose === PURPOSE_OTHER_VALUE && isBlank(data.purposeDetail),

    // 기술 스택 목록 비어있는지 검증
    isEmptyList(data.techStacks),
  ];

  return checks.some(Boolean);
}
