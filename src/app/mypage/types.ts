/**
 * 마이페이지 전용 타입 (프로필 타입은 @/app/profile/types)
 * - 마이페이지는 프로필 완료 후에만 진입하므로 PUT(수정)만 사용, POST(생성)는 /profile에서만 사용
 */
import type {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { ApiRequest, ApiResponse } from "@/types/api/helpers";
import type {
  ProfileFormData,
  UpdateProfileRequest,
} from "@/app/profile/types";

export type {
  GetProfileResponse,
  ProfileFormData,
  UpdateProfileRequest,
} from "@/app/profile/types";

/** PUT /api/profile 응답 (마이페이지는 수정만 사용) */
export type UpdateProfileResponse = ApiResponse<"/api/profile", "put", 200>;
export type PresignedUrlRequest = ApiRequest<"/api/file/presigned-url", "post">;
export type PresignedUrlResponse = ApiResponse<
  "/api/file/presigned-url",
  "post",
  200
>;

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
