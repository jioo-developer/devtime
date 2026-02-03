"use client";

import CommonChip from "@/components/atoms/CommonChip/CommonChip";
import { CAREER_OPTIONS, getEnumLabel, getPurposeLabel } from "../constants";
import type { GetProfileResponse } from "../types";

type ProfileViewProps = {
  profileData: GetProfileResponse | undefined;
};

export function ProfileView({ profileData }: ProfileViewProps) {
  const techStackList = profileData?.profile?.techStacks ?? [];
  const hasTechStacks = techStackList.length > 0;
  return (
    <div className="profileView">
      <section className="profileSection">
        <span className="profileSectionLabel">이메일 주소</span>
        <p className="profileSectionValue">{profileData?.email ?? "—"}</p>
      </section>

      <section className="profileSection">
        <span className="profileSectionLabel">개발 경력</span>
        {profileData?.profile?.career ? (
          <p className="profileSectionValue">
            {getEnumLabel(profileData.profile.career, CAREER_OPTIONS)}
          </p>
        ) : (
          <p className="profileSectionPlaceholder">
            개발 경력을 업데이트 해주세요.
          </p>
        )}
      </section>

      <section className="profileSection">
        <span className="profileSectionLabel">공부 목적</span>
        {profileData?.profile?.purpose ? (
          <p className="profileSectionValue">
            {getPurposeLabel(profileData.profile.purpose)}
          </p>
        ) : (
          <p className="profileSectionPlaceholder">
            공부 목적을 업데이트 해주세요.
          </p>
        )}
      </section>

      <section className="profileSection">
        <span className="profileSectionLabel">개발 스택</span>
        {hasTechStacks ? (
          <div className="stackTags">
            {techStackList.map((techStackLabel) => (
              <CommonChip
                key={techStackLabel}
                variant="outlined"
                size="md"
              >
                {techStackLabel}
              </CommonChip>
            ))}
          </div>
        ) : (
          <p className="profileSectionPlaceholder">
            현재 공부 중인 또는 가지고 있는 개발 스택을 업데이트 해주세요.
          </p>
        )}
      </section>
    </div>
  );
}
