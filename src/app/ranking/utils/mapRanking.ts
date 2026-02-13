import { getPurposeLabel } from "@/app/profile/constants/constants";
import type { PurposeFromApi } from "@/app/profile/constants/constants";
import { getProfileImageUrl } from "@/app/mypage/constants";
import type { RankingEntry, RankingItem } from "../types";

const SECONDS_PER_HOUR = 3600;
const MAX_TECH_STACKS = 5;

export function toRankingEntry(item: RankingItem): RankingEntry {
  const totalHours =
    Math.round((item.totalStudyTime / SECONDS_PER_HOUR) * 10) / 10;

  const dailyAvgHours =
    Math.round((item.averageStudyTime / SECONDS_PER_HOUR) * 10) / 10;
  const purposeLabel = getPurposeLabel(
    (item.profile?.purpose ?? undefined) as PurposeFromApi,
  );

  const techStacks = (item.profile?.techStacks ?? [])
    .map((techStack) => techStack.name)
    .slice(0, MAX_TECH_STACKS);

  return {
    rank: item.rank,
    userId: item.userId,
    nickname: item.nickname,
    totalHours,
    dailyAvgHours,
    career: item.profile?.career ?? "",
    purposeLabel,
    techStacks,
    profileImageUrl: getProfileImageUrl(item.profile?.profileImage ?? null),
  };
}
