import type {
  CreateProfileRequest,
  GetProfileResponse,
  ProfileFormData,
  UpdateProfileRequest,
} from "../types";
import {
  CAREER_API_VALUES,
  PURPOSE_API_VALUES,
  PURPOSE_OTHER_VALUE,
  toAllowedEnumValue,
} from "../constants";

export function getFormDefaultValuesFromProfile(
  profileData: GetProfileResponse | undefined,
): ProfileFormData {
  const purposeFromApi = profileData?.profile?.purpose;
  const purpose =
    typeof purposeFromApi === "string"
      ? purposeFromApi
      : purposeFromApi?.type === "기타"
        ? PURPOSE_OTHER_VALUE
        : "";
  const purposeDetail =
    typeof purposeFromApi === "object" &&
    purposeFromApi?.type === "기타" &&
    purposeFromApi.detail
      ? purposeFromApi.detail
      : "";

  return {
    nickname: profileData?.nickname ?? "",
    goal: profileData?.profile?.goal ?? "",
    career: profileData?.profile?.career ?? "",
    purpose,
    purposeDetail,
    techStacks: profileData?.profile?.techStacks ?? [],
    profileImage: profileData?.profile?.profileImage ?? "",
    newPassword: "",
    newPasswordConfirmation: "",
  };
}

export function getCreateProfilePayload(
  formData: ProfileFormData,
  profileData: GetProfileResponse | undefined,
): CreateProfileRequest {
  const career = toAllowedEnumValue(
    formData.career || profileData?.profile?.career,
    CAREER_API_VALUES,
  );
  const purpose =
    formData.purpose === PURPOSE_OTHER_VALUE
      ? { type: "기타" as const, detail: formData.purposeDetail?.trim() ?? "" }
      : toAllowedEnumValue(
          formData.purpose ||
          (typeof profileData?.profile?.purpose === "string"
            ? profileData.profile.purpose
            : undefined),
          PURPOSE_API_VALUES,
        );
  const goal = (formData.goal?.trim() || profileData?.profile?.goal) ?? "";
  const techStacks =
    (formData.techStacks?.length ?? 0) > 0
      ? formData.techStacks
      : (profileData?.profile?.techStacks ?? []);
  const profileImage =
    (formData.profileImage || profileData?.profile?.profileImage) ?? "";

  return {
    career,
    purpose,
    goal,
    techStacks,
    profileImage: profileImage || "",
  };
}

export function getUpdateProfilePayload(
  formData: ProfileFormData,
  profileData: GetProfileResponse | undefined,
): UpdateProfileRequest {
  const base = getCreateProfilePayload(formData, profileData);
  const nickname =
    (formData.nickname?.trim() || profileData?.nickname) ?? "";
  const profileImage =
    (formData.profileImage || profileData?.profile?.profileImage) ?? "";
  const newPassword = formData.newPassword?.trim();
  const newPasswordConfirmation = formData.newPasswordConfirmation?.trim();
  const includePassword =
    !!newPassword &&
    newPassword === newPasswordConfirmation;

  return {
    ...base,
    nickname,
    ...(profileImage && { profileImage }),
    ...(includePassword && { password: newPassword }),
  };
}
