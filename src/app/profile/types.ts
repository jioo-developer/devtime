import type { ApiRequest, ApiResponse } from "@/types/api/helpers";

export type GetProfileResponse = ApiResponse<"/api/profile", "get", 200>;
export type CreateProfileRequest = ApiRequest<"/api/profile", "post">;
export type CreateProfileResponse = ApiResponse<"/api/profile", "post", 200>;
export type UpdateProfileRequest = ApiRequest<"/api/profile", "put">;

/** 프로필 폼 필드 (react-hook-form) */
export type ProfileFormData = {
  nickname: string;
  goal: string;
  career: string;
  purpose: string;
  /** purpose가 "기타"일 때만 사용 */
  purposeDetail: string;
  techStacks: string[];
  profileImage: string;
  /** 회원정보 수정 시에만 사용(선택) */
  newPassword?: string;
  newPasswordConfirmation?: string;
  /** 닉네임 중복 확인 성공 메시지 (UI 전용, API 전송 제외) */
  nicknameVerified?: string;
};
