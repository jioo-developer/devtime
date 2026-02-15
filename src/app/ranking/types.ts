import type { ApiResponseSuccess } from "@/types/api/helpers";

/** GET /api/rankings 응답 */
export type GetRankingsResponse = ApiResponseSuccess<"/api/rankings", "get">;

/** API 정렬 기준 (total: 총 학습 시간, avg: 일 평균 학습 시간) */
export type RankingSortBy = "total" | "avg";

/** 랭킹 탭: 총 학습 시간 | 일 평균 학습 시간 (UI) */
export type RankingTabType = "total" | "dailyAvg";

/** API 랭킹 한 건 (GET /api/rankings data.rankings 요소) */
type Rankings = GetRankingsResponse["data"]["rankings"];
export type RankingItem = Rankings[number];

/** 카드 표시용 랭킹 (시간은 시간 단위, techStacks 최대 5개) */
export type RankingEntry = {
  rank: number;
  userId: string;
  nickname: string;
  totalHours: number;
  dailyAvgHours: number;
  career: string;
  purposeLabel: string;
  techStacks: string[];
  profileImageUrl: string | null;
};
