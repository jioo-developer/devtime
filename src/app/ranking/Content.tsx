"use client";

import { RankingList } from "./components/RankingList";
import { useGetRankings } from "./hooks/useGetRankings";

export function RankingPageContent({ sortBy }: { sortBy: "total" | "avg" }) {
  const query = useGetRankings({ sortBy });
  const entries = query.data.pages.flatMap((page) => page.rankings);

  return (
    <RankingList
      entries={entries}
      hasNextPage={!!query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      onLoadMore={query.fetchNextPage}
    />
  );
}
