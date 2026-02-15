"use client";
import "./DashboardSkeleton.css";

export function DashboardSkeleton() {
  return (
    <div
      className="dashboardSkeleton"
      aria-busy="true"
      aria-label="대시보드 로딩 중"
    >
      <div className="dashboardSkeleton__kpi">
        {[1, 2, 3].map((i) => (
          <div key={i} className="dashboardSkeleton__card" />
        ))}
      </div>
      <div className="dashboardSkeleton__heatmap">
        <div className="dashboardSkeleton__line dashboardSkeleton__line--title" />
        <div className="dashboardSkeleton__grid" />
      </div>
      <div className="dashboardSkeleton__records">
        <div className="dashboardSkeleton__line dashboardSkeleton__line--title" />
        <div className="dashboardSkeleton__table">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="dashboardSkeleton__row" />
          ))}
        </div>
      </div>
    </div>
  );
}
