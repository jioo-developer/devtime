"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import { PUBLIC_PATHS } from "@/hooks/useIsLoggedIn";

function isPublicPath(pathname: string | null): boolean {
  const path = pathname ?? "/";
  return PUBLIC_PATHS.some(
    (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`),
  );
}

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isPublic = isPublicPath(pathname);

  // 공개 페이지에서는 헤더를 렌더링하지 않음
  if (isPublic) return null;

  return <Header />;
}
