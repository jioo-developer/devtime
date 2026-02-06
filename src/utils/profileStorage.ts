const PROFILE_COMPLETE_KEY = "profileComplete";

export function setProfileComplete(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_COMPLETE_KEY, "1");
  } catch {
    // ignore
  }
}

export function getProfileComplete(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(PROFILE_COMPLETE_KEY) === "1";
  } catch {
    return false;
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
