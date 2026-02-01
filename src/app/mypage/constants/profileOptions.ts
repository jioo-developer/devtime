/**
 * 프로필 셀렉트 옵션 (OpenAPI 스펙 기준)
 * - Career, Purpose, Tech Stack 순으로 도메인별 정의
 * - 각 도메인: API 값 목록 → 타입 → OPTIONS (정규화/라벨은 toAllowedEnumValue, getEnumLabel 사용)
 */

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

// ─── Career ─────────────────────────────────────────────────────────────
export type CareerApiValue = (typeof CAREER_API_VALUES)[number];

export const CAREER_API_VALUES = [
  "경력 없음",
  "0 - 3년",
  "4 - 7년",
  "8 - 10년",
  "11년 이상",
] as const;


export const CAREER_OPTIONS = createOptions(CAREER_API_VALUES);

// ─── Purpose ────────────────────────────────────────────────────────────
export type PurposeApiValue = (typeof PURPOSE_API_VALUES)[number];

/** API에서 오는 purpose: enum 문자열 또는 기타(detail) */
export type PurposeFromApi = PurposeApiValue | { type: "기타"; detail: string } | undefined;

export const PURPOSE_API_VALUES = [
  "취업 준비",
  "이직 준비",
  "단순 개발 역량 향상",
  "회사 내 프로젝트 원활하게 수행",
] as const;

export const PURPOSE_OPTIONS = createOptions(PURPOSE_API_VALUES);

export function getPurposeLabel(purposeFromApi: PurposeFromApi): string {
  if (!purposeFromApi) return "";
  if (typeof purposeFromApi === "object") {
    return purposeFromApi.detail ? `기타: ${purposeFromApi.detail}` : "기타";
  }
  return getEnumLabel(purposeFromApi, PURPOSE_OPTIONS);
}

// ─── Tech Stack ─────────────────────────────────────────────────────────

const TECH_STACK_NAMES = [
  "React",
  "Vue.js",
  "Angular",
  "Svelte",
  "Next.js",
  "Gatsby",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Java",
  "Spring",
  "Django",
  "Go",
  "Rust",
] as const;

export const TECH_STACK_OPTIONS = createOptions(TECH_STACK_NAMES);

// ─── 내부 헬퍼 (위 도메인에서 공통 사용) ─────────────────────────────────

type EnumValues = readonly string[];
type OptionalString = string | undefined;
type EnumOptions<T extends string> = readonly SelectOption<T>[];

function createOptions<T extends EnumValues>(allowedValues: T) {
  return allowedValues.map((allowedValue) => ({
    value: allowedValue,
    label: allowedValue,
  })) as { value: T[number]; label: string }[];
}

export function toAllowedEnumValue<T extends EnumValues>(
  userInput: OptionalString,
  allowedValues: T,
): T[number] {
  const defaultValue = allowedValues[0] as T[number];
  if (!userInput) return defaultValue;
  return (allowedValues as readonly string[]).includes(userInput)
    ? (userInput as T[number])
    : defaultValue;
}

export function getEnumLabel<T extends string>(
  valueFromApi: OptionalString,
  options: EnumOptions<T>,
): string {
  if (!valueFromApi) return "";
  return options.find((option) => option.value === valueFromApi)?.label ?? valueFromApi;
}
