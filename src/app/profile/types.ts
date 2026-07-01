import type { ApiRequest, ApiResponseSuccess } from "@/types/api/helpers";
import type { z } from "zod";
import { profileCreateSchema, profileUpdateSchema } from "@/schema/formSchemas";

export type GetProfileResponse = ApiResponseSuccess<"/api/profile", "get">;
export type CreateProfileRequest = ApiRequest<"/api/profile", "post">;
export type CreateProfileResponse = ApiResponseSuccess<"/api/profile", "post">;
export type UpdateProfileRequest = ApiRequest<"/api/profile", "put">;

/** 프로필 생성 폼 필드 (react-hook-form) */
export type ProfileCreateFormData = z.infer<typeof profileCreateSchema>;

/** 프로필 수정 폼 필드 (react-hook-form) */
export type ProfileFormData = z.infer<typeof profileUpdateSchema>;
