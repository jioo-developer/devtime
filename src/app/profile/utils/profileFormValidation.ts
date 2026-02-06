import { PURPOSE_OTHER_VALUE } from "@/app/mypage/constants";
import type { ProfileFormData } from "@/app/mypage/types";

export function isProfileFormIncomplete(data: ProfileFormData): boolean {
  const isBlankString = (value?: string) => !value?.trim();

  const isEmptyList = (list?: unknown[]) =>
    !Array.isArray(list) || list.length === 0;

  if (isBlankString(data.career)) return true;
  if (isBlankString(data.purpose)) return true;

  const isOtherPurpose = data.purpose === PURPOSE_OTHER_VALUE;
  if (isOtherPurpose && isBlankString(data.purposeDetail)) return true;

  if (isBlankString(data.goal)) return true;
  if (isEmptyList(data.techStacks)) return true;
  if (isBlankString(data.profileImage)) return true;

  return false;
}
