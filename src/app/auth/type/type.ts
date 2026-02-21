export type AuthFormData = {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
  /** 중복 확인 성공 메시지 (react-hook-form 상태로 관리) */
  emailVerified?: string;
  nicknameVerified?: string;
};
export type AuthPageProps = {
  // 테스트 코드용 속성
  onSubmit?: (data: AuthFormData) => Promise<void>;
};
