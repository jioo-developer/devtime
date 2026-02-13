"use client";
import { useEffect } from "react";
import { PageErrorFallback } from "@/components/PageErrorFallback";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageErrorFallback
      error={error}
      resetErrorBoundary={reset}
      message="문제가 발생했습니다. 다시 시도해 주세요."
    />
  );
}
