import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import type { ApiResponseSuccess } from "@/types/api/helpers";

export type StudyLogTaskItem = { content: string; isCompleted: boolean };

export type StudyLogData = {
  data: { todayGoal: string; tasks: StudyLogTaskItem[] };
};

// 타입 : 학습 기록 조회 시 할 일 목록을 표시하기 위해 사용

// request type
type StudyLogApiResponse = ApiResponseSuccess<
  "/api/study-logs/{studyLogId}",
  "get"
>;

// response result type
export type StudyLogResponse = {
  data: {
    todayGoal: string;
    tasks: Array<{ id?: number; content: string; isCompleted?: boolean }>;
  };
};

export const useGetStudyLog = (
  studyLogId: string | undefined,
): UseQueryResult<StudyLogData, Error> => {
  return useQuery<StudyLogApiResponse, Error, StudyLogData>({
    queryKey: [QueryKey.STUDY_LOGS, studyLogId],
    queryFn: async () => {
      if (!studyLogId) {
        throw new Error("studyLogId is required");
      }
      return await ApiClient.get("/api/study-logs/{studyLogId}", {
        pathParams: { studyLogId },
        headers: getAuthHeaders(),
      });
    },
    select: (res) =>
      ({
        data: {
          todayGoal: res.data.todayGoal,
          tasks: (res.data.tasks ?? []).map((task) => ({
            content: task.content,
            isCompleted: task.isCompleted ?? false,
          })),
        },
      }) as StudyLogData,
    enabled: Boolean(studyLogId),
    retry: 3,
    staleTime: 0,
    refetchOnMount: true,
  });
};
