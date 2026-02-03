import { useMutation } from "@tanstack/react-query";
import type { Path } from "react-hook-form";
import { ApiClient } from "@/config/apiConfig";
import { UseChecValidationlParams } from "./hookTypes";

const NICKNAME_FIELD = "nickname" as const;

export const useCheckNickname = <T extends { nickname: string }>({
  setError,
  clearErrors,
  setSuccessMessage,
}: UseChecValidationlParams<T>) => {
  return useMutation({
    mutationFn: (nickname: string) =>
      ApiClient.get("/api/signup/check-nickname", {
        query: { nickname },
      }),
    onSuccess: (data) => {
      if (!data.available) {
        setError(NICKNAME_FIELD as Path<T>, {
          type: "manual",
          message: data.message || "이미 사용 중인 닉네임입니다.",
        });
      } else {
        clearErrors(NICKNAME_FIELD as Path<T>);
        setSuccessMessage("사용 가능한 닉네임입니다.");
      }
    },
    onError: () => {
      setError(NICKNAME_FIELD as Path<T>, {
        type: "manual",
        message: "닉네임 중복 체크에 실패했습니다.",
      });
    },
  });
};
