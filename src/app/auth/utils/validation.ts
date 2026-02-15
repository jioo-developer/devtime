import type { UseFormWatch, FieldErrors } from "react-hook-form";
import type { AuthFormData } from "../Client";

interface FormValidationParams {
  watch: UseFormWatch<AuthFormData>;
  agreed: boolean;
  errors: FieldErrors<AuthFormData>;
}

export const isAuthFormValid = ({
  watch,
  agreed,
  errors,
}: FormValidationParams): boolean => {
  const {
    email,
    nickname,
    password,
    passwordConfirmation,
    emailVerified,
    nicknameVerified,
  } = watch();

  return (
    !!email &&
    !!emailVerified &&
    !!nickname &&
    !!nicknameVerified &&
    !!password &&
    !!passwordConfirmation &&
    !errors.password &&
    !errors.passwordConfirmation &&
    agreed
  );
};
