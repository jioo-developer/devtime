import { z } from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN } from "@/constant/password";
import { PURPOSE_OTHER_VALUE } from "@/app/profile/constants/constants";

// 프로필 공통 입력값을 정의하는 기본 스키마
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

// 프로필 생성 폼 검증 스키마
export const profileCreateSchema = baseProfileSchema;

// 프로필 수정 폼 검증 스키마
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
