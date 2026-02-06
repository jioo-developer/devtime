/** 랭킹 탭: 총 학습 시간 | 일 평균 학습 시간 */
export type RankingTabType = "total" | "dailyAvg";

export type RankingEntry = {
  rank: number;
  nickname: string;
  motto: string;
  totalHours: number;
  dailyAvgHours: number;
  career: string;
  tags: string[];
  profileImageUrl?: string;
};
