import type { GetProfileResponse } from "../types";

/**
 * API 응답(GetProfileResponse) 기준으로 프로필이 모두 채워져 있는지 여부
 * - career, purpose, goal, techStacks, profileImage 모두 있어야 완성
 */
export function isProfileComplete(
  profileResponse: GetProfileResponse | undefined,
): boolean {
  const profile = profileResponse?.profile;
  if (!profile) return false;

  const career = profile.career?.trim();
  const goal = profile.goal?.trim();
  const profileImage = profile.profileImage?.trim();
  const techStacks = profile.techStacks;

  const purpose = profile.purpose;
  const hasPurpose =
    typeof purpose === "string"
      ? purpose.trim().length > 0
      : purpose?.type === "기타"
        ? Boolean(purpose.detail?.trim())
        : false;

  if (!career) return false;
  if (!hasPurpose) return false;
  if (!goal) return false;
  if (!Array.isArray(techStacks) || techStacks.length === 0) return false;
  if (!profileImage) return false;
  return true;
}
