import {
  useQuery,
  useSuspenseQuery,
  UseQueryResult,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import type { StatsDisplay } from "../utils/normalizeStatsResponse";
import { toStatsDisplay } from "../utils/normalizeStatsResponse";

const statsQueryOptions = {
  queryKey: [QueryKey.STATS] as const,
  queryFn: async () => {
    const res = await ApiClient.get("/api/stats", {
      headers: getAuthHeaders(),
    });
    return toStatsDisplay(res);
  },
  staleTime: 60 * 1000,
};

export function useGetStats(
  enabled: boolean = true,
): UseQueryResult<StatsDisplay, Error> {
  return useQuery({
    ...statsQueryOptions,
    enabled,
  });
}

export function useGetStatsSuspense(): UseSuspenseQueryResult<
  StatsDisplay,
  Error
> {
  return useSuspenseQuery(statsQueryOptions);
}
