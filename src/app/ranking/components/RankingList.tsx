"use client";

import { useRef } from "react";
import { RankingCard } from "./RankingCard";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import type { RankingEntry } from "../types";

export function RankingList({
  entries,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  entries: RankingEntry[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}) {
  const sentinelRef = useRef<HTMLLIElement>(null);

  useInfiniteScroll({
    enabled: hasNextPage && !isFetchingNextPage,
    targetRef: sentinelRef,
    onIntersect: onLoadMore,
    rootMargin: "100px",
  });

  return (
    <ol className="rankingList">
      {entries.map((entry) => (
        <RankingCard key={`${entry.userId}-${entry.rank}`} {...entry} />
      ))}

      {hasNextPage ? (
        <li ref={sentinelRef} className="rankingList__sentinel" aria-hidden>
          {isFetchingNextPage ? "로딩 중..." : null}
        </li>
      ) : null}
    </ol>
  );
}
