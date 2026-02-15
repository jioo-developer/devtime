"use client";

import "./RankingSkeleton.css";

const SKELETON_COUNT = 6;

export function RankingSkeleton() {
  return (
    <ol
      className="rankingList rankingSkeleton"
      aria-busy="true"
      aria-label="랭킹 로딩 중"
    >
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <li key={i} className="rankingSkeleton__card">
          <div className="rankingSkeleton__badge" />
          <div className="rankingSkeleton__avatar" />
          <div className="rankingSkeleton__body">
            <div className="rankingSkeleton__line rankingSkeleton__line--title" />
            <div className="rankingSkeleton__line rankingSkeleton__line--sub" />
            <div className="rankingSkeleton__metrics">
              <div className="rankingSkeleton__line rankingSkeleton__line--sm" />
              <div className="rankingSkeleton__line rankingSkeleton__line--sm" />
              <div className="rankingSkeleton__line rankingSkeleton__line--sm" />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
