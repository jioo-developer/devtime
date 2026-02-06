/**
 * 로그인 페이지로 리다이렉트
 * - 현재 URL을 redirect 파라미터로 전달
 */
export function redirectToLogin() {
  if (typeof window === "undefined") return;

  const { pathname, search, hash } = window.location;
  const currentUrl = `${pathname}${search}${hash}`;

  const redirect = encodeURIComponent(currentUrl || "/");
  window.location.replace(`/login?redirect=${redirect}`);
}

/**
 * Access Token이 없으면 에러를 던짐
 * - 토큰이 없으면 네트워크 요청 자체를 보내지 않고 에러 발생
 * - 리다이렉트는 호출부에서 처리해야 함
 */
export interface UnauthorizedError extends Error {
  name: "UnauthorizedError";
  code: "UNAUTHORIZED";
}

export function createUnauthorizedError(
  message = "Access token is required",
): UnauthorizedError {
  const error = new Error(message) as UnauthorizedError;
  error.name = "UnauthorizedError";
  error.code = "UNAUTHORIZED";
  return error;
}

export function isUnauthorizedError(
  error: unknown,
): error is UnauthorizedError {
  if (!(error instanceof Error)) return false;
  const unAuthorizedError = error as UnauthorizedError;
  return unAuthorizedError.code === "UNAUTHORIZED";
}

/**
 * Access Token이 없으면 에러를 던짐
 * - 토큰이 없으면 네트워크 요청 자체를 보내지 않고 에러 발생
 * - 리다이렉트는 호출부에서 처리해야 함
 */
export function getAccessTokenOrThrow(
  getAccessToken: () => string | null,
): string {
  const token = getAccessToken();
  if (!token) throw createUnauthorizedError();
  return token;
}
