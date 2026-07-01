import { z } from "zod";

// 투두 폼의 공통 입력값을 정의하는 기본 스키마
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

// 투두 생성 폼 검증 스키마
export const todoCreateSchema = todoFormSchema.extend({
  title: z.string().nonempty({ message: "목표를 입력해 주세요." }).max(30, {
    message: "최대 30자까지 입력 가능합니다.",
  }),
});

// 공부 종료 시 회고 작성 검증 스키마
export const todoEndSchema = z.object({
  reflection: z
    .string()
    .nonempty({ message: "학습 회고를 작성해 주세요." })
    .min(15, { message: "15자 이상 작성해 주세요." })
    .max(500, { message: "500자 이하로 작성해 주세요." }),
});

// 투두 항목 수정 검증 스키마
export const todoListItemEditSchema = z.object({
  text: z
    .string()
    .nonempty({ message: "할 일을 입력해 주세요." })
    .max(30, { message: "최대 30자까지 입력 가능합니다." }),
});
