"use client";

import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
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
      <div className="profileInfo">
        {mypageForm.isEditing ? (
          <>
            <CommonInput
              id="nickname"
              type="text"
              label="닉네임"
              placeholder="닉네임"
              register={mypageForm.register}
              className="profileFormInput"
            />
            <CommonInput
              id="goal"
              type="text"
              label="공부 목표"
              placeholder="슈퍼 개발자가 돼서 지구 정복"
              register={mypageForm.register}
              className="profileFormInput"
            />
          </>
        ) : (
          <>
            <h1 className="profileName">
              {profileData?.nickname || "닉네임"}
            </h1>
            {profileData?.profile?.goal ? (
              <p className="profileMotto">{profileData.profile.goal}</p>
            ) : (
              <p className="profileMotto">아직 설정한 목표가 없어요.</p>
            )}
          </>
        )}
      </div>
      {!mypageForm.isEditing && (
        <CommonButton
          type="button"
          theme="none"
          className="editProfileButton"
          aria-label={
            hasExistingProfile ? "회원정보 수정" : "프로필 만들기"
          }
          onClick={() => mypageForm.setIsEditing(true)}
          width="auto"
        >
          <MdEdit size={20} />
          {hasExistingProfile ? "회원정보 수정" : "프로필 만들기"}
        </CommonButton>
      )}
    </div>
  );
}
