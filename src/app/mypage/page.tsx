import type { Metadata } from "next";
import { Client } from "./Client";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "내 프로필을 확인하고 수정해 보세요.",
};

export default function MypagePage() {
  return <Client />;
}
