import type { Metadata } from "next";
import { Client } from "./Client";

export const metadata: Metadata = {
  title: "대시보드",
  description: "공부 기록과 통계를 확인해 보세요.",
};

export default function DashboardPage() {
  return <Client />;
}
