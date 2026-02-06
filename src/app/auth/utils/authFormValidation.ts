import type { UseFormWatch, FieldErrors } from "react-hook-form";
import type { AuthFormData } from "../Client";

interface FormValidationParams {
  watch: UseFormWatch<AuthFormData>;
  emailSuccess: string;
  nicknameSuccess: string;
  agreed: boolean;
  errors: FieldErrors<AuthFormData>;
}

export const isAuthFormValid = ({
  watch,
  emailSuccess,
  nicknameSuccess,
  agreed,
  errors,
}: FormValidationParams): boolean => {
  const { email, nickname, password, passwordConfirmation } = watch();

  return (
    !!email &&
    !!emailSuccess &&
    !!nickname &&
    !!nicknameSuccess &&
    !!password &&
    !!passwordConfirmation &&
    !errors.password &&
    !errors.passwordConfirmation &&
    agreed
  );
};
