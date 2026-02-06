"use client";

import { useState } from "react";
import "./style.css";
import { RankingTabs } from "./components/RankingTabs";
import { RankingCard } from "./components/RankingCard";
import type { RankingTabType } from "./components/RankingTabs";
import { MOCK_RANKING } from "./data/mockRanking";

export default function RankingPage() {
  const [tab, setTab] = useState<RankingTabType>("total");

  return (
    <main className="rankingPage">
      <RankingTabs value={tab} onChange={setTab} />
      <ol className="rankingList">
        {MOCK_RANKING.map((entry) => (
          <li key={entry.rank}>
            <RankingCard entry={entry} />
          </li>
        ))}
      </ol>
    </main>
  );
}
