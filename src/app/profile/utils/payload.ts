// 프로필 생성/수정에 필요한 요청·응답·폼 타입 정의
import type {
  CreateProfileRequest,
  GetProfileResponse,
  ProfileCreateFormData,
  ProfileFormData,
  UpdateProfileRequest,
} from "@/app/profile/types";

// career / purpose 관련 enum 허용값과 정규화 유틸
import {
  CAREER_API_VALUES,
  PURPOSE_API_VALUES,
  PURPOSE_OTHER_VALUE,
  toAllowedEnumValue,
} from "@/app/profile/constants/constants";

/**
 * 문자열을 trim한 뒤 값이 없으면 항상 빈 문자열 반환
 * - undefined / null / 공백 문자열을 모두 ""로 통일
 */
const trimmedOrEmpty = (value: string | null | undefined): string =>
  value?.trim() ?? "";

/**
 * preferred 값을 우선 사용하고,
 * - preferred가 비어 있으면 fallback 사용
 * - 둘 다 비어 있으면 ""
 */
const preferredOrFallback = (
  preferred: string | null | undefined,
  fallback: string | null | undefined,
): string => trimmedOrEmpty(preferred) || trimmedOrEmpty(fallback) || "";

/** 기존 프로필이 없을 때 사용하는 기본값 (기본 프로필 이미지 등으로 대체, undefined 미전달) */
const DEFAULT_PROFILE_RESPONSE: GetProfileResponse = {
  email: "",
  nickname: "",
  profile: {
    career: CAREER_API_VALUES[0],
    purpose: PURPOSE_API_VALUES[0],
    techStacks: [],
    profileImage: "", // 기본 프로필 이미지로 대체
  },
};

/**
 * 폼의 purpose / purposeDetail을
 * API 요청용 purpose payload로 변환
 */
function formPurpose(
  formData: ProfileCreateFormData, // 현재 폼 입력값
  profileData: GetProfileResponse, // 기존 프로필 데이터(없으면 DEFAULT_PROFILE_RESPONSE 사용)
): CreateProfileRequest["purpose"] {
  // 폼에서 '기타'를 선택한 경우 → detail이 있을 때만 object 전송 (빈 detail은 서버 400 방지)
  if (formData.purpose === PURPOSE_OTHER_VALUE) {
    const detail = trimmedOrEmpty(formData.purposeDetail);
    if (detail) {
      return { type: "기타", detail };
    }
    // detail 없으면 기존 purpose 또는 enum fallback 사용
    const fallback =
      typeof profileData.profile?.purpose === "string"
        ? profileData.profile.purpose
        : PURPOSE_API_VALUES[0];
    return toAllowedEnumValue(fallback, PURPOSE_API_VALUES);
  }

  /* 기타가 아닌 경우 → string enum으로 전송
    - 폼 값이 없으면 기존 profile의 purpose(string) 사용,
    - 그것도 없으면 PURPOSE_API_VALUES의 첫 값을 fallback으로 사용 */
  const fallback =
    typeof profileData.profile?.purpose === "string"
      ? profileData.profile.purpose
      : PURPOSE_API_VALUES[0];

  return toAllowedEnumValue(formData.purpose || fallback, PURPOSE_API_VALUES);
}

/**
 * 폼 데이터 → 프로필 생성 요청 body
 * - 수정 시에도 profileData를 넘겨 fallback 용도로 재사용
 */
export function getCreateProfilePayload(
  formData: ProfileCreateFormData, // 현재 폼 입력 데이터
  profileData?: GetProfileResponse, // 기존 프로필 없으면 기본 프로필 이미지 등으로 대체
): CreateProfileRequest {
  const effectiveProfileData = profileData ?? DEFAULT_PROFILE_RESPONSE;
  const profile = effectiveProfileData.profile;

  // career: 폼 값 우선, 없으면 기존 profile 값 → enum 정규화
  const career = toAllowedEnumValue(
    formData.career || profile?.career,
    CAREER_API_VALUES,
  );

  // purpose: 별도 헬퍼에서 변환
  const purpose = formPurpose(formData, effectiveProfileData);

  // goal: 폼 값 우선, 없으면 기존 값
  const goal = preferredOrFallback(formData.goal, profile?.goal);

  // techStacks: 폼에서 선택된 값이 있으면 사용, 없으면 기존 값
  const techStacks = formData.techStacks?.length
    ? formData.techStacks
    : (profile?.techStacks ?? []);

  // profileImage: 폼 값 우선, 없으면 기존 값
  const profileImage = preferredOrFallback(
    formData.profileImage,
    profile?.profileImage,
  );

  // CreateProfileRequest 형태로 payload 조립
  return {
    career,
    purpose,
    techStacks,
    ...(goal && { goal }), // goal이 있을 때만 포함
    ...(profileImage && { profileImage }), // profileImage가 있을 때만 포함
  };
}

/**
 * payload에서 빈 값 제거 (서버 400 방지)
 * - 빈 문자열, undefined, null 제외
 */
function omitEmptyValues<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== "" && v !== undefined && v !== null,
    ),
  ) as Partial<T>;
}

/**
 * 폼 데이터 → 프로필 수정 요청 body
 * - 빈 문자열은 전송하지 않음 (서버 검증 400 방지)
 */
export function getUpdateProfilePayload(
  formData: ProfileFormData, // 현재 폼 입력값
  profileData?: GetProfileResponse, // 기존 프로필 없으면 기본값 사용
): UpdateProfileRequest {
  const effectiveProfileData = profileData ?? DEFAULT_PROFILE_RESPONSE;
  const base = getCreateProfilePayload(formData, effectiveProfileData);

  // nickname: 폼 값 우선, 없으면 기존 nickname (빈 문자열이면 기존 값 사용)
  const nickname = preferredOrFallback(
    formData.nickname,
    effectiveProfileData.nickname,
  );

  // 새 비밀번호와 확인값을 각각 trim
  const newPassword = trimmedOrEmpty(formData.newPassword);
  const confirmation = trimmedOrEmpty(formData.newPasswordConfirmation);

  // 비밀번호 포함 조건:
  // - 값이 존재하고
  // - 확인값과 일치할 때만
  const shouldIncludePassword = !!newPassword && newPassword === confirmation;

  const raw: Record<string, unknown> = {
    ...base,
    nickname: nickname || effectiveProfileData.nickname || undefined,
    ...(shouldIncludePassword && { password: newPassword }),
  };

  // 빈 값 제거 후 반환 (서버가 "" 또는 [] 거부하는 경우 대비)
  return omitEmptyValues(raw) as UpdateProfileRequest;
}
