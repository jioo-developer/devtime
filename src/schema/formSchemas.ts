import { z } from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN } from "@/constant/password";
import { PURPOSE_OTHER_VALUE } from "@/app/profile/constants/constants";

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, {
    message: `비밀번호는 ${PASSWORD_MIN_LENGTH}자리 이상이어야 합니다.`,
  })
  .regex(PASSWORD_PATTERN, {
    message: "비밀번호는 영문과 숫자를 포함해야 합니다.",
  });

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

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "이메일을 입력하세요." })
    .email({ message: "이메일 형식으로 작성해 주세요." }),
  password: passwordSchema,
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "이메일을 입력하세요." })
    .email({ message: "이메일 형식으로 작성해 주세요." }),
});

const baseProfileSchema = z
  .object({
    goal: z.string().nonempty({ message: "공부 목표를 입력하세요." }),
    career: z.string().nonempty({ message: "개발 경력을 선택하세요." }),
    purpose: z.string().nonempty({ message: "공부 목적을 선택하세요." }),
    purposeDetail: z.string().optional(),
    techStacks: z
      .array(z.string())
      .min(1, { message: "기술 스택을 한 개 이상 선택해 주세요." }),
    profileImage: z.string().nonempty({
      message: "프로필 이미지를 업로드 해 주세요.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.purpose === PURPOSE_OTHER_VALUE && !data.purposeDetail?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["purposeDetail"],
        message: "공부 목적을 입력해 주세요.",
      });
    }
  });

export const profileCreateSchema = baseProfileSchema;

export const profileUpdateSchema = baseProfileSchema
  .extend({
    nickname: z.string().nonempty({ message: "닉네임을 입력하세요." }),
    newPassword: z.string().optional(),
    newPasswordConfirmation: z.string().optional(),
    nicknameVerified: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword?.trim()) {
      if (data.newPassword.length < PASSWORD_MIN_LENGTH) {
        ctx.addIssue({
          code: "custom",
          path: ["newPassword"],
          message: `새 비밀번호는 ${PASSWORD_MIN_LENGTH}자리 이상이어야 합니다.`,
        });
      }
      if (!PASSWORD_PATTERN.test(data.newPassword)) {
        ctx.addIssue({
          code: "custom",
          path: ["newPassword"],
          message: "비밀번호는 영문과 숫자를 포함해야 합니다.",
        });
      }
      if (data.newPassword !== data.newPasswordConfirmation) {
        ctx.addIssue({
          code: "custom",
          path: ["newPasswordConfirmation"],
          message: "비밀번호가 일치하지 않습니다.",
        });
      }
    }
  });

export const todoFormSchema = z.object({
  title: z.string().optional(),
  todoInput: z
    .string()
    .max(30, { message: "최대 30자까지 입력 가능합니다." })
    .optional(),
  reflection: z
    .string()
    .min(15, { message: "15자 이상 작성해 주세요." })
    .max(500, { message: "500자 이하로 작성해 주세요." })
    .optional(),
});

export const todoCreateSchema = todoFormSchema.extend({
  title: z.string().nonempty({ message: "목표를 입력해 주세요." }).max(30, {
    message: "최대 30자까지 입력 가능합니다.",
  }),
});

export const todoEndSchema = z.object({
  reflection: z
    .string()
    .nonempty({ message: "학습 회고를 작성해 주세요." })
    .min(15, { message: "15자 이상 작성해 주세요." })
    .max(500, { message: "500자 이하로 작성해 주세요." }),
});

export const todoListItemEditSchema = z.object({
  text: z
    .string()
    .nonempty({ message: "할 일을 입력해 주세요." })
    .max(30, { message: "최대 30자까지 입력 가능합니다." }),
});
