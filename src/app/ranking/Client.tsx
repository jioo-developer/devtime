"use client";
import { useState, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import "./style.css";
import { RankingTabs } from "./components/RankingTabs";
import type { RankingTabType } from "./components/RankingTabs";
import { RankingPageContent } from "./Content";
import { RankingSkeleton } from "./components/RankingSkeleton";
import CommonDropdown from "@/components/modules/CommonDropdown/CommonDropdown";
import { TECH_STACK_OPTIONS } from "@/app/profile/constants/constants";
import { PageErrorFallback } from "@/components/PageErrorFallback";

const TECH_STACK_FILTER_OPTIONS = [
  { value: "", label: "전체" },
  ...TECH_STACK_OPTIONS,
];

export function Client() {
  const [tab, setTab] = useState<RankingTabType>("total");
  const [techStackFilter, setTechStackFilter] = useState("");
  const sortBy: "total" | "avg" = tab === "dailyAvg" ? "avg" : "total";

  return (
    <main className="rankingPage">
      <RankingTabs value={tab} onChange={setTab} />
      <div className="rankingPage__filter">
        <p className="rankingPage__filterLabel">같은 스택만 보기</p>
        <CommonDropdown
          label=""
          placeholder="전체"
          options={TECH_STACK_FILTER_OPTIONS}
          value={techStackFilter}
          onChange={setTechStackFilter}
          className="rankingPage__filterDropdown"
        />
      </div>
      <ErrorBoundary
        fallbackRender={(props) => (
          <PageErrorFallback {...props} message="랭킹을 불러오지 못했습니다." />
        )}
        key={`${sortBy}-${techStackFilter}`}
      >
        <Suspense fallback={<RankingSkeleton />}>
          <RankingPageContent
            sortBy={sortBy}
            techStackFilter={techStackFilter}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
