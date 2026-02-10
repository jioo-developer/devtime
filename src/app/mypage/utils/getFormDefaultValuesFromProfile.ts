import type { GetProfileResponse, ProfileFormData } from "@/app/profile/types";
import { PURPOSE_OTHER_VALUE } from "@/app/profile/constants/constants";

type ApiPurpose = NonNullable<GetProfileResponse["profile"]>["purpose"];

/** API purpose → 폼용 purpose, purposeDetail */
function apiPurposeToForm(purpose: ApiPurpose | undefined): {
  purpose: string;
  purposeDetail: string;
} {
  if (!purpose || typeof purpose === "string") {
    return { purpose: purpose ?? "", purposeDetail: "" };
  }
  if (purpose.type === "기타") {
    return {
      purpose: PURPOSE_OTHER_VALUE,
      purposeDetail: purpose.detail ?? "",
    };
  }
  return { purpose: "", purposeDetail: "" };
}

/** 프로필 조회 데이터 → 폼 기본값 (마이페이지 수정 폼용) */
export function getFormDefaultValuesFromProfile(
  profileData: GetProfileResponse | undefined,
): ProfileFormData {
  const { purpose, purposeDetail } = apiPurposeToForm(
    profileData?.profile?.purpose,
  );
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
