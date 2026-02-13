"use client";
import { RankingList } from "./components/RankingList";
import { RankingSkeleton } from "./components/RankingSkeleton";
import { useGetRankings } from "./hooks/useGetRankings";

const ERROR_MESSAGE = "랭킹을 불러오지 못했습니다.";

type RankingPageContentProps = {
  sortBy: "total" | "avg";
  techStackFilter?: string;
};

export function RankingPageContent({
  sortBy,
  techStackFilter = "",
}: RankingPageContentProps) {
  const query = useGetRankings({ sortBy });

  if (query.isPending) {
    return <RankingSkeleton />;
  }

  if (query.isError) {
    return <p className="rankingPage__error">{ERROR_MESSAGE}</p>;
  }

  const allEntries = query.data.pages.flatMap((page) => page.rankings);
  const entries = !techStackFilter
    ? allEntries
    : allEntries.filter((entry) => entry.techStacks.includes(techStackFilter));

  return (
    <RankingList
      entries={entries}
      hasNextPage={!!query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      onLoadMore={query.fetchNextPage}
    />
  );
}
