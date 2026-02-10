"use client";
import "./style.css";
import { KpiSection } from "./components/KpiSection";
import { HeatmapSection } from "./components/HeatmapSection";
import { RecordsSection } from "./components/RecordsSection";

export function Client() {
  return (
    <main className="dashboardPage">
      <KpiSection />
      <HeatmapSection />
      <RecordsSection />
    </main>
  );
}
