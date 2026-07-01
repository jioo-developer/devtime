import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import type { ApiResponseSuccess } from "@/types/api/helpers";

/** GET /api/timers 200 응답 (404 시 default 반환으로 동일 형태) */
export type TimerResponse = ApiResponseSuccess<"/api/timers", "get">;

const defaultTimerResponse: TimerResponse = {
  timerId: "",
  studyLogId: "",
  splitTimes: [],
  startTime: "",
  lastUpdateTime: null,
};

export const useGetTimers = (
  enabled: boolean = true,
): UseQueryResult<TimerResponse, Error> => {
  return useQuery<TimerResponse, Error>({
    queryKey: [QueryKey.TIMERS],
    enabled,
    queryFn: async (): Promise<TimerResponse> => {
      const response = await ApiClient.get("/api/timers", {
        headers: getAuthHeaders(),
        onNotOk: async (res) => {
          if (res.status === 404) return defaultTimerResponse as TimerResponse;
          throw new Error("GET /api/timers failed");
        },
      });
      return response as TimerResponse;
    },
    retry: 3,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    initialData: defaultTimerResponse,
  });
};
