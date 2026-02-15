"use client";
import { PageErrorFallback } from "@/components/PageErrorFallback";
type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <PageErrorFallback
      error={error}
      resetErrorBoundary={reset}
      message="문제가 발생했습니다. 다시 시도해 주세요."
    />
  );
}
