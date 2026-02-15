import type { Path } from "react-hook-form";
import {
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import { AuthFormData } from "../Client";

export interface CheckDuplicateResponse {
  success: boolean;
  available: boolean;
  message: string;
}

export interface UseChecValidationlParams<
  T extends { nickname: string } = AuthFormData,
> {
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
  setValue: UseFormSetValue<T>;
  /** 중복 확인 성공 시 메시지를 넣을 폼 필드 (react-hook-form 상태로 관리해 useState 제거) */
  successField: Path<T>;
}
