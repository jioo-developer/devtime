"use client";
import type { FallbackProps } from "react-error-boundary";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

type PageErrorFallbackProps = FallbackProps & {
  message?: string;
};

export function PageErrorFallback({
  resetErrorBoundary,
  message = "문제가 발생했습니다.",
}: PageErrorFallbackProps) {
  return (
    <div className="pageErrorFallback" role="alert">
      <p className="pageErrorFallback__message">{message}</p>
      <CommonButton theme="primary" onClick={resetErrorBoundary}>
        다시 시도
      </CommonButton>
    </div>
  );
}
