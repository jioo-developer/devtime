/**
 * 마이페이지 API 타입 — OpenAPI generated + helpers 기반 (수동 정의 제거)
 */
import type { ApiRequest, ApiResponse } from "@/types/api/helpers";
import type {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export type GetProfileResponse = ApiResponse<"/api/profile", "get", 200>;
export type CreateProfileRequest = ApiRequest<"/api/profile", "post">;
export type UpdateProfileRequest = ApiRequest<"/api/profile", "put">;
export type ProfileSuccessResponse = ApiResponse<"/api/profile", "post", 200>;
export type PresignedUrlRequest = ApiRequest<"/api/file/presigned-url", "post">;
export type PresignedUrlResponse = ApiResponse<
  "/api/file/presigned-url",
  "post",
  200
>;

/** 프로필 폼 필드 (react-hook-form) */
export type ProfileFormData = {
  nickname: string;
  goal: string;
  career: string;
  purpose: string;
  techStacks: string[];
  profileImage: string;
  /** 회원정보 수정 시에만 사용(선택) */
  newPassword?: string;
  newPasswordConfirmation?: string;
};

export type CreateProfileMutation = (
  createPayload: CreateProfileRequest,
  callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void },
) => void;

export type UpdateProfileMutation = (
  updatePayload: UpdateProfileRequest,
  callbacks?: { onSuccess?: () => void; onError?: (err: Error) => void },
) => void;

/** useMypageForm 반환값 */
export type MypageFormReturn = {
  register: UseFormRegister<ProfileFormData>;
  watch: UseFormWatch<ProfileFormData>;
  setValue: UseFormSetValue<ProfileFormData>;
  setError: UseFormSetError<ProfileFormData>;
  clearErrors: UseFormClearErrors<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  handleSave: () => void;
  handleCancel: () => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
};
