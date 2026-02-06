/**
 * 안전한 내부 경로인지 검증
 */
export function safeInternalPath(value: string | null): string | null {
  if (!value) return null;

  const startsWithSlash = value.startsWith("/");
  const startsWithDoubleSlash = value.startsWith("//");
  const containsBackslash = value.includes("\\");

  if (!startsWithSlash) return null; // "/"로 시작하지 않으면 null 반환
  if (startsWithDoubleSlash) return null; // "//"로 시작하면 null 반환
  if (containsBackslash) return null; // "\\"가 포함되어 있으면 null 반환

  return value;
}
