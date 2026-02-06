"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIsLoggedIn } from "@/app/Home/hooks/useIsLoggedIn";
import { useGetProfile } from "@/app/mypage/hooks/useGetProfile";
import { isProfileComplete } from "@/app/mypage/utils/profileCompletion";

const PATHS_WITHOUT_PROFILE_GUARD = ["/profile", "/login", "/auth"] as const;

function isPathWithoutGuard(pathname: string | null): boolean {
  const path = pathname ?? "/";
  return PATHS_WITHOUT_PROFILE_GUARD.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

/**
 * 로그인된 사용자가 프로필 미완성 시 /profile로 리다이렉트.
 * /profile, /login, /auth에서는 검사하지 않음.
 */
export default function ProfileGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isReady } = useIsLoggedIn();

  const shouldSkipGuard = useMemo(
    () => isPathWithoutGuard(pathname),
    [pathname],
  );

  const shouldFetchProfile = isReady && isLoggedIn && !shouldSkipGuard;

  const { data: profileData, isLoading, isError } =
    useGetProfile(shouldFetchProfile);

  useEffect(() => {
    if (!shouldFetchProfile) return;
    if (isLoading || isError || !profileData) return;

    const isComplete = isProfileComplete(profileData);
    if (!isComplete) router.replace("/profile");
  }, [shouldFetchProfile, isLoading, isError, profileData, router]);

  return null;
}
