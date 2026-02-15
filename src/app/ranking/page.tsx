import type { Metadata } from "next";
import { Client } from "./Client";

export const metadata: Metadata = {
  title: "랭킹",
  description: "공부 시간 랭킹을 확인해 보세요.",
};

export default function RankingPage() {
  return <Client />;
}
