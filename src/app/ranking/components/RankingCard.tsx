"use client";
import CommonBadge from "@/components/atoms/CommonBadge/CommonBadge";
import CommonChip from "@/components/atoms/CommonChip/CommonChip";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import type { RankingEntry } from "../types";
import DefaultProfileImage from "@/asset/images/default_profile_image.svg";
import "./RankingCard.css";

export function RankingCard({
  rank,
  nickname,
  motto,
  totalHours,
  dailyAvgHours,
  career,
  tags,
  profileImageUrl,
}: RankingEntry) {
  return (
    <article className="rankingCard">
      <div className="rankingCard__inner">
        <CommonBadge
          text={`${rank}위`}
          variant="primary"
          size="large"
          className="rankingCard__rankBadge"
        />
        <div className="rankingCard__avatarWrap">
          <CommonImage
            src={profileImageUrl ?? DefaultProfileImage}
            alt={`${nickname} 프로필`}
            width={64}
            height={64}
            className="rankingCard__avatar"
          />
        </div>
        <div className="rankingCard__body">
          <h3 className="rankingCard__nickname">{nickname}</h3>
          <p className="rankingCard__motto">{motto}</p>
          <ul className="rankingCard__metrics">
            <li>누적 {totalHours}시간</li>
            <li>일 평균 {dailyAvgHours}시간</li>
            <li>경력 {career}</li>
          </ul>
          {tags.length > 0 && (
            <div className="rankingCard__tags">
              {tags.map((tag, index) => (
                <CommonChip
                  key={`${tag}-${index}`}
                  size="sm"
                  variant="outlined"
                >
                  {tag}
                </CommonChip>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
