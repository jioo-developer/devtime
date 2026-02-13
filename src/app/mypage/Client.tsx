"use client";
import { Suspense, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/navigation";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useGetProfile } from "./hooks/useGetProfile";
import { MypageSkeleton } from "./components";
import { MypageContent } from "./Content";
import { PageErrorFallback } from "@/components/PageErrorFallback";
import { useModalStore } from "@/store/modalStore";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import "./style.css";

type MypageGateState = "showSkeleton" | "noProfile" | "showContent";

const NO_PROFILE_MODAL = {
  title: "알림",
  content: "작성된 프로필이 없습니다. 프로필페이지로 이동하겠습니다.",
} as const;

export function Client() {
  const state = useMypageGateState();

  switch (state) {
    case "noProfile":
      return <NoProfileModalThenRedirect />;
    case "showContent":
      return <MypageContentPage />;
    default:
      return <MypageSkeletonPage />;
  }
}

function useMypageGateState(): MypageGateState {
  const { isLoggedIn, isReady } = useIsLoggedIn();
  const { data, isPending, isError, isSuccess } = useGetProfile();

  if (!isReady || !isLoggedIn || isPending) {
    return "showSkeleton";
  }

  if (isError || (isSuccess && !data?.profile)) {
    return "noProfile";
  }

  return "showContent";
}

function NoProfileModalThenRedirect() {
  const router = useRouter();
  const openModal = useModalStore((state) => state.push);
  const closeModal = useModalStore((state) => state.closeTop);
  const openedRef = useRef(false);

  useEffect(() => {
    if (openedRef.current) return;
    openedRef.current = true;

    openModal({
      title: NO_PROFILE_MODAL.title,
      content: NO_PROFILE_MODAL.content,
      footer: (
        <CommonButton
          theme="primary"
          onClick={() => {
            closeModal();
            router.replace("/profile");
          }}
        >
          확인
        </CommonButton>
      ),
      BackdropMiss: false,
    });
  }, [openModal, closeModal, router]);

  return <MypageSkeletonPage />;
}

function MypageContentPage() {
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

function MypageSkeletonPage() {
  return (
    <main className="mypagePage">
      <MypageSkeleton />
    </main>
  );
}
