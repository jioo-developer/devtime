"use client";

import { useState } from "react";
import "./style.css";
import {
  useGetProfile,
  useUpdateProfile,
  useUploadProfileImage,
  useMypageForm,
} from "./hooks";
import { ProfileHeader, ProfileForm, ProfileView } from "./components";

export default function MypagePage() {
  const { data: profileData, isLoading: isProfileLoading } = useGetProfile();
  const { mutate: updateProfileMutation, isPending: isUpdating } =
    useUpdateProfile();
  const { upload: uploadProfileImage } = useUploadProfileImage();

  const [isEditing, setIsEditing] = useState(false);

  const mypageForm = useMypageForm(
    profileData,
    isEditing,
    setIsEditing,
    updateProfileMutation,
  );

  if (isProfileLoading) {
    return (
      <main className="mypagePage">
        <div className="profileCard profileCardLoading">로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="mypagePage">
      <div className="profileCard">
        {!mypageForm.isEditing && (
          <ProfileHeader
            profileData={profileData}
            mypageForm={mypageForm}
            hasExistingProfile={Boolean(profileData?.profile)}
          />
        )}

        {mypageForm.isEditing && profileData?.profile ? (
          <ProfileForm
            profileData={profileData}
            mypageForm={mypageForm}
            hasExistingProfile
            isUpdating={isUpdating}
            onProfileImageUpload={(file) => {
              uploadProfileImage(file).then((uploadedImageKey) => {
                if (uploadedImageKey)
                  mypageForm.setValue("profileImage", uploadedImageKey);
              });
            }}
          />
        ) : (
          <ProfileView profileData={profileData} />
        )}
      </div>
    </main>
  );
}
