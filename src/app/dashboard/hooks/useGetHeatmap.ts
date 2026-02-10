import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { QueryKey } from "@/constant/queryKeys";
import type { HeatmapResponse } from "../types";
import { getMockGrid } from "../utils/mockHeatmapGrid";

export function useGetHeatmap(
  enabled: boolean = true,
): UseQueryResult<HeatmapResponse, Error> {
  return useQuery({
    queryKey: [QueryKey.HEATMAP],
    enabled,
    queryFn: async () => {
      const cells = getMockGrid(new Date().getFullYear());
      return { heatmap: cells };
    },
    staleTime: 60 * 1000,
  });
}
