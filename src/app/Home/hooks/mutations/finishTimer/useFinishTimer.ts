import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

export type FinishTimerTaskItem = {
  content: string;
  isCompleted: boolean;
};

export type FinishTimerSplitItem = {
  date: string;
  timeSpent: number;
};

export type FinishTimerRequest = {
  splitTimes: FinishTimerSplitItem[];
  tasks: FinishTimerTaskItem[];
  review: string;
};

type FinishTimerVariables = {
  timerId: string;
  data: FinishTimerRequest;
};

export type FinishTimerResponse = {
  message: string;
  totalTime?: number;
  endTime?: string;
};

export const useFinishTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<FinishTimerResponse, Error, FinishTimerVariables>({
    mutationFn: async ({ timerId, data }) => {
      const res = await ApiClient.post(
        "/api/timers/{timerId}/stop",
        data,
        {
          pathParams: { timerId },
          headers: getAuthHeaders(),
          onNotOk: async (response) => {
            throw new Error(
              `POST /api/timers/${timerId}/stop failed: ${response.status} ${response.statusText}`
            );
          },
        },
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
    },
  });
};
