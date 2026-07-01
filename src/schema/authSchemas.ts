import { z } from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN } from "@/constant/password";

// 인증 관련 공통 비밀번호 검증 스키마
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, {
    message: `비밀번호는 ${PASSWORD_MIN_LENGTH}자리 이상이어야 합니다.`,
  })
  .regex(PASSWORD_PATTERN, {
    message: "비밀번호는 영문과 숫자를 포함해야 합니다.",
  });

// 회원가입 폼 검증 스키마
export const authSchema = z
  .object({
    email: z
      .string()
      .nonempty({ message: "이메일을 입력하세요." })
      .email({ message: "이메일 형식으로 작성해 주세요." }),
    nickname: z.string().nonempty({ message: "닉네임을 입력하세요." }),
    password: passwordSchema,
    passwordConfirmation: z.string().nonempty({
      message: "비밀번호를 다시 입력해 주세요.",
    }),
    emailVerified: z.string().nonempty({
      message: "이메일 중복 확인을 해주세요.",
    }),
    nicknameVerified: z.string().nonempty({
      message: "닉네임 중복 확인을 해주세요.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordConfirmation"],
        message: "비밀번호가 일치하지 않습니다.",
      });
    }
  });

// 로그인 폼 검증 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "이메일을 입력하세요." })
    .email({ message: "이메일 형식으로 작성해 주세요." }),
  password: passwordSchema,
});

// 비밀번호 재설정 이메일 입력 검증 스키마
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "이메일을 입력하세요." })
    .email({ message: "이메일 형식으로 작성해 주세요." }),
});
