/**
 * 프로필 완료 여부 플래그 (localStorage)
 * - 프로필 생성/수정 완료 시 설정, 로그아웃 시 삭제
 */

const PROFILE_COMPLETE_KEY = "profileComplete";

export function getProfileComplete(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(PROFILE_COMPLETE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setProfileComplete(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_COMPLETE_KEY, "true");
  } catch {
    // ignore
  }
}

export function clearProfileComplete(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROFILE_COMPLETE_KEY);
  } catch {
    // ignore
  }
}
