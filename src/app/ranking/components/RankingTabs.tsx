"use client";

import "./RankingTabs.css";

export type RankingTabType = "total" | "dailyAvg";

type RankingTabsProps = {
  value: RankingTabType;
  onChange: (value: RankingTabType) => void;
};

const TABS: { value: RankingTabType; label: string }[] = [
  { value: "total", label: "총 학습 시간" },
  { value: "dailyAvg", label: "일 평균 학습 시간" },
];

export function RankingTabs({ value, onChange }: RankingTabsProps) {
  return (
    <div className="rankingTabs" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          className={
            value === tab.value ? "rankingTabs__tabActive" : "rankingTabs__tab"
          }
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
