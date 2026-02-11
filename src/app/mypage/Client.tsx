"use client";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { getProfileComplete } from "@/app/profile/utils/localStorage";
import { MypageSkeleton } from "./components";
import { MypageContent } from "./Content";
import "./style.css";

type MypageGateState = "redirectToProfile" | "showContent" | "showSkeleton";

export function Client() {
  const state = useMypageGateState();

  switch (state) {
    case "redirectToProfile":
      return <RedirectToProfile />;
    case "showContent":
      return <MypageContentPage />;
    default:
      return <MypageSkeletonPage />;
  }
}

function useMypageGateState(): MypageGateState {
  const { isLoggedIn, isReady } = useIsLoggedIn();
  const hasProfileCompleteFlag = getProfileComplete();

  if (!isReady || !isLoggedIn) {
    return "showSkeleton";
  }

  if (!hasProfileCompleteFlag) {
    return "redirectToProfile";
  }

  return "showContent";
}

function RedirectToProfile() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile");
  }, [router]);

  return null;
}

function MypageContentPage() {
  return (
    <main className="mypagePage">
      <Suspense fallback={<MypageSkeleton />}>
        <MypageContent />
      </Suspense>
    </main>
  );
}

function MypageSkeletonPage() {
  return (
    <main className="mypagePage">
      <MypageSkeleton />
    </main>
  );
}
