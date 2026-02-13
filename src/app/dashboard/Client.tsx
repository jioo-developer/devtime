"use client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import "./style.css";
import { KpiSection } from "./components/KpiSection";
import { HeatmapSection } from "./components/HeatmapSection";
import { RecordsSection } from "./components/RecordsSection";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { PageErrorFallback } from "@/components/PageErrorFallback";

export function Client() {
  return (
    <main className="dashboardPage">
      <ErrorBoundary
        fallbackRender={(props) => (
          <PageErrorFallback
            {...props}
            message="대시보드를 불러오지 못했습니다."
          />
        )}
      >
        <Suspense fallback={<DashboardSkeleton />}>
          <KpiSection />
          <HeatmapSection />
          <RecordsSection />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
