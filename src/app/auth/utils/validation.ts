import type { UseFormWatch, FieldErrors } from "react-hook-form";
import { AuthFormData } from "../type/type";

interface FormValidationParams {
  watch: UseFormWatch<AuthFormData>;
  agreed: boolean;
  errors: FieldErrors<AuthFormData>;
}

export const AUTH_DEFAULT_VALUES: AuthFormData = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirmation: "",
  emailVerified: "",
  nicknameVerified: "",
};

export const isAuthFormValid = ({
  watch,
  agreed,
  errors,
}: FormValidationParams): boolean => {
  const formData = watch();

  // 필수 필드 검증
  const requiredFields: (keyof AuthFormData)[] = [
    "email",
    "nickname",
    "password",
    "passwordConfirmation",
  ];

  // 모든 필수 필드가 입력되었는지 검증
  const hasAllRequiredFields = requiredFields.every(
    (field) => !!formData[field],
  );

  // 중복 확인 성공 메시지가 있는지 검증
  const hasSuccessMessages = !!(
    formData.emailVerified && formData.nicknameVerified
  );

  // 비밀번호 확인 필드 에러 검증
  const hasPasswordErrors = !!(errors.password || errors.passwordConfirmation);

  // 모든 검증 조건을 충족하는지 검증
  return (
    hasAllRequiredFields && hasSuccessMessages && !hasPasswordErrors && agreed
  );
};
