import { UseFormClearErrors, UseFormSetError } from "react-hook-form";
import { AuthFormData } from "../types";

export interface CheckDuplicateResponse {
  success: boolean;
  available: boolean;
  message: string;
}

export interface UseChecValidationlParams<T extends { nickname: string } = AuthFormData> {
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
  setSuccessMessage: (message: string) => void;
}
