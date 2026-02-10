/**
 * 마이페이지 전용 타입 (프로필 타입은 @/app/profile/types)
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
import type {
  CreateProfileRequest,
  ProfileFormData,
  UpdateProfileRequest,
} from "@/app/profile/types";

export type {
  CreateProfileRequest,
  GetProfileResponse,
  ProfileFormData,
  UpdateProfileRequest,
} from "@/app/profile/types";

export type ProfileSuccessResponse = ApiResponse<"/api/profile", "post", 200>;
export type PresignedUrlRequest = ApiRequest<"/api/file/presigned-url", "post">;
export type PresignedUrlResponse = ApiResponse<
  "/api/file/presigned-url",
  "post",
  200
>;

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
