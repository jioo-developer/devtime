import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import type { GetRankingsResponse, RankingSortBy } from "../types";
import { toRankingEntry } from "../utils/mapRanking";

const DEFAULT_LIMIT = 10;

const DEFAULT_RANKINGS_RESPONSE = {
  rankings: [],
  pagination: {
    hasNext: false,
    hasPrev: false,
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  },
} as const;

export type UseGetRankingsParams = {
  sortBy: RankingSortBy;
  limit?: number;
};

export function useGetRankings({
  sortBy,
  limit = DEFAULT_LIMIT,
}: UseGetRankingsParams) {
  return useSuspenseInfiniteQuery({
    queryKey: [QueryKey.RANKINGS, sortBy, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = (await ApiClient.get("/api/rankings", {
        query: { sortBy, page: pageParam, limit },
      })) as GetRankingsResponse;

      const data = res.data ?? DEFAULT_RANKINGS_RESPONSE;
      return {
        rankings: data.rankings.map(toRankingEntry),
        pagination: data.pagination,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasNext) return undefined;
      return lastPage.pagination.currentPage + 1;
    },
    initialPageParam: 1,
  });
}
