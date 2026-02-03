import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import type { ApiResponse } from "@/types/api/helpers";

/** GET /api/timers 200 응답 (404 시 default 반환으로 동일 형태) */
export type TimerResponse = ApiResponse<"/api/timers", "get", 200>;

const defaultTimerResponse: TimerResponse = {
  timerId: "",
  studyLogId: "",
  splitTimes: [],
  startTime: "",
  lastUpdateTime: null,
};

export const useGetTimers = (
  enabled: boolean = true
): UseQueryResult<TimerResponse, Error> => {
  return useQuery<TimerResponse, Error>({
    queryKey: [QueryKey.TIMERS],
    enabled,
    queryFn: async (): Promise<TimerResponse> => {
      const res = await ApiClient.get("/api/timers", {
        headers: getAuthHeaders(),
        onNotOk: async (response) => {
          if (response.status === 404) return defaultTimerResponse;
          throw new Error("GET /api/timers failed");
        },
      });
      return "error" in res ? defaultTimerResponse : res;
    },
    retry: 3,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    initialData: defaultTimerResponse,
  });
};