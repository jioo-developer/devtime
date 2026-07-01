/**
 * 프로필 셀렉트 옵션 (OpenAPI 스펙 기준) — 마이페이지에서도 사용
 */

import { ProfileCreateFormData } from "../types";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type EnumValues = readonly string[];
type OptionalString = string | undefined;
type EnumOptions<T extends string> = readonly SelectOption<T>[];

function createOptions<T extends EnumValues>(allowedValues: T) {
  return allowedValues.map((allowedValue) => ({
    value: allowedValue,
    label: allowedValue,
  })) as { value: T[number]; label: string }[];
}

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
export type PurposeFromApi =
  | PurposeApiValue
  | { type: "기타"; detail: string }
  | undefined;

export const PURPOSE_API_VALUES = [
  "취업 준비",
  "이직 준비",
  "단순 개발 역량 향상",
  "회사 내 프로젝트 원활하게 수행",
] as const;

export const PURPOSE_OPTIONS = createOptions(PURPOSE_API_VALUES);

/** 공부 목적 "기타" 선택 시 상세 입력용 */
export const PURPOSE_OTHER_VALUE = "기타" as const;

export const PURPOSE_OPTIONS_WITH_OTHER: { value: string; label: string }[] = [
  ...PURPOSE_OPTIONS,
  { value: PURPOSE_OTHER_VALUE, label: "직접입력" },
];

export function getPurposeLabel(purposeFromApi: PurposeFromApi): string {
  if (!purposeFromApi) return "";
  if (typeof purposeFromApi === "object") {
    return purposeFromApi.detail ? `기타: ${purposeFromApi.detail}` : "기타";
  }
  return getEnumLabel(purposeFromApi, PURPOSE_OPTIONS);
}

// ─── 유틸 ───────────────────────────────────────────────────────────────

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
  return (
    options.find((option) => option.value === valueFromApi)?.label ??
    valueFromApi
  );
}

export const DefaultFormData: ProfileCreateFormData = {
  goal: "",
  career: "",
  purpose: "",
  purposeDetail: "",
  techStacks: [],
  profileImage: "",
};
