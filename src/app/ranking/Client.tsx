"use client";
import { useState, Suspense } from "react";
import "./style.css";
import { RankingTabs } from "./components/RankingTabs";
import { RankingSkeleton } from "./components/RankingSkeleton";
import { ErrorBoundary } from "react-error-boundary";
import type { RankingTabType } from "./components/RankingTabs";
import { RankingPageContent } from "./Content";

export function Client() {
  const [tab, setTab] = useState<RankingTabType>("total");
  const sortBy: "total" | "avg" = tab === "dailyAvg" ? "avg" : "total";

  return (
    <main className="rankingPage">
      <RankingTabs value={tab} onChange={setTab} />

      <ErrorBoundary
        fallback={
          <p className="rankingPage__error">랭킹을 불러오지 못했습니다.</p>
        }
      >
        <Suspense fallback={<RankingSkeleton />}>
          <RankingPageContent sortBy={sortBy} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
