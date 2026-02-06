/**
 * 토큰 만료 시간(클라이언트 기준)을 쿠키에 저장/조회하는 유틸
 */

const ACCESS_TOKEN_EXPIRY_COOKIE = "accessTokenExpiry";
const REFRESH_TOKEN_EXPIRY_COOKIE = "refreshTokenExpiry";

const ACCESS_MAX_AGE_SEC = 60 * 60; // 1h
const REFRESH_MAX_AGE_SEC = 60 * 60 * 24 * 10; // 10d

type CookieOptions = {
  path?: string;
  maxAgeSec?: number;
  sameSite?: "Lax" | "Strict" | "None";
  secure?: boolean;
};

// 쿠키 조회
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const cookiePairs = document.cookie ? document.cookie.split("; ") : [];
  const targetPrefix = `${name}=`;

  const matchedPair = cookiePairs.find((pair) => pair.startsWith(targetPrefix));

  if (!matchedPair) return null;

  const encodedValue = matchedPair.slice(targetPrefix.length);
  return decodeURIComponent(encodedValue);
}

// 쿠키 설정
function setCookie(name: string, value: string, options: CookieOptions) {
  if (typeof document === "undefined") return;

  const path = options.path ?? "/";
  const sameSite = options.sameSite ?? "Lax";

  const parts: string[] = [
    `${name}=${encodeURIComponent(value)}`,
    `path=${path}`,
    `SameSite=${sameSite}`,
  ];

  if (typeof options.maxAgeSec === "number")
    parts.push(`max-age=${options.maxAgeSec}`);
  if (options.secure) parts.push("Secure");

  document.cookie = parts.join("; ");
}

// 쿠키 삭제
function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  setCookie(name, "", { maxAgeSec: 0, sameSite: "Lax" });
}

// 만료 시간 쿠키 설정
function setExpiryCookie(cookieName: string, maxAgeSec: number) {
  const expiryMs = Date.now() + maxAgeSec * 1000;

  setCookie(cookieName, String(expiryMs), {
    maxAgeSec,
    sameSite: "Lax",
    secure: typeof location !== "undefined" && location.protocol === "https:",
  });
}

/** Access Token 만료 시간 설정 */
export function setAccessTokenExpiry() {
  setExpiryCookie(ACCESS_TOKEN_EXPIRY_COOKIE, ACCESS_MAX_AGE_SEC);
}

/** Refresh Token 만료 시간 설정 */
export function setRefreshTokenExpiry() {
  setExpiryCookie(REFRESH_TOKEN_EXPIRY_COOKIE, REFRESH_MAX_AGE_SEC);
}

function isExpiryCookieValid(cookieName: string): boolean {
  const expiryValue = getCookie(cookieName);
  if (!expiryValue) return false;

  const expiryMs = Number(expiryValue);
  if (!Number.isFinite(expiryMs)) return false;

  return Date.now() < expiryMs;
}

/** Access Token 만료 확인 */
export function isAccessTokenValid(): boolean {
  return isExpiryCookieValid(ACCESS_TOKEN_EXPIRY_COOKIE);
}

/** Refresh Token 만료 확인 */
export function isRefreshTokenValid(): boolean {
  return isExpiryCookieValid(REFRESH_TOKEN_EXPIRY_COOKIE);
}

/** 모든 토큰 만료 쿠키 삭제 */
export function clearTokenExpiryCookies() {
  deleteCookie(ACCESS_TOKEN_EXPIRY_COOKIE);
  deleteCookie(REFRESH_TOKEN_EXPIRY_COOKIE);
}
