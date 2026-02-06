"use client";

import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { MdEdit, MdPerson } from "react-icons/md";
import { getProfileImageUrl } from "../constants";
import type { GetProfileResponse } from "../types";
import type { MypageFormReturn } from "../hooks";

type ProfileHeaderProps = {
  profileData: GetProfileResponse | undefined;
  mypageForm: MypageFormReturn;
  hasExistingProfile: boolean;
};

export function ProfileHeader({
  profileData,
  mypageForm,
  hasExistingProfile,
}: ProfileHeaderProps) {
  const profileImageDisplayUrl = getProfileImageUrl(
    profileData?.profile?.profileImage,
  );
  return (
    <div className="profileHeader">
      <div className="profileAvatarWrap">
        {profileImageDisplayUrl ? (
          <CommonImage
            src={profileImageDisplayUrl}
            alt="프로필"
            width={120}
            height={120}
          />
        ) : (
          <MdPerson className="profileAvatarPlaceholder" size={48} />
        )}
      </div>
      {!mypageForm.isEditing && (
        <>
          <div className="profileInfo">
            <h1 className="profileName">{profileData?.nickname || "닉네임"}</h1>
            {profileData?.profile?.goal ? (
              <p className="profileMotto">{profileData.profile.goal}</p>
            ) : (
              <p className="profileMotto">아직 설정한 목표가 없어요.</p>
            )}
          </div>
          {hasExistingProfile && (
            <CommonButton
              type="button"
              theme="none"
              className="editProfileButton"
              aria-label="회원정보 수정"
              onClick={() => mypageForm.setIsEditing(true)}
              width="auto"
            >
              <MdEdit size={20} />
              회원정보 수정
            </CommonButton>
          )}
        </>
      )}
    </div>
  );
}
