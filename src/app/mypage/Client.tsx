"use client";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { getProfileComplete } from "@/app/profile/utils/localStorage";
import { MypageSkeleton } from "./components";
import { MypageContent } from "./Content";
import "./style.css";

export function Client() {
  // 1) 라우팅/로그인 상태
  const router = useRouter();
  const { isLoggedIn, isReady } = useIsLoggedIn();

  // 2) 프로필 완료 여부(로컬 스토리지)
  const hasProfileCompleteFlag = getProfileComplete();

  // 3) 프로필 조회 여부(조건 명확화)
  const shouldRedirectToProfile =
    isReady && isLoggedIn && !hasProfileCompleteFlag;
  const shouldFetchProfile = isReady && isLoggedIn && hasProfileCompleteFlag;

  // 4) 가드: 완료 플래그 없으면 /profile로 이동
  useEffect(() => {
    if (!shouldRedirectToProfile) return;
    router.replace("/profile");
  }, [shouldRedirectToProfile, router]);

  // 5) 리다이렉트 직전 깜빡임 방지
  if (shouldRedirectToProfile) return null;

  // 6) 렌더링
  return (
    <main className="mypagePage">
      <Suspense fallback={<MypageSkeleton />}>
        {shouldFetchProfile ? <MypageContent /> : <MypageSkeleton />}
      </Suspense>
    </main>
  );
}
