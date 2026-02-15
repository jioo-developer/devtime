"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { MypageSkeleton } from "./components";
import { MypageContent } from "./Content";
import { ProfileRequiredGuard } from "./utils/ProfileRequiredGuard";
import { useGetProfile } from "./hooks/useGetProfile";
import { PageErrorFallback } from "@/components/PageErrorFallback";
import "./style.css";

export function Client() {
  const { isLoggedIn, isReady } = useIsLoggedIn();
  const { data, isPending, isError, isSuccess } = useGetProfile();

  const isLoading = !isReady || !isLoggedIn || isPending;
  const hasNoProfile = isError || (isSuccess && !data?.profile);

  if (isLoading) {
    return (
      <main className="mypagePage">
        <MypageSkeleton />
      </main>
    );
  }
  if (hasNoProfile) return <ProfileRequiredGuard />;

  return (
    <main className="mypagePage">
      <ErrorBoundary
        fallbackRender={(props) => (
          <PageErrorFallback
            {...props}
            message="프로필을 불러오지 못했습니다."
          />
        )}
      >
        <Suspense fallback={<MypageSkeleton />}>
          <MypageContent />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
