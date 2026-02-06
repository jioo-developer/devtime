"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css";
import {
  useGetProfile,
  useUpdateProfile,
  useUploadProfileImage,
  useMypageForm,
} from "./hooks";
import { ProfileHeader, ProfileForm, ProfileView } from "./components";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { getProfileComplete } from "@/utils/profileStorage";

export default function MypagePage() {
  const router = useRouter();
  const { isLoggedIn, isReady } = useIsLoggedIn();

  const hasProfileCompleteFlag = getProfileComplete();

  const shouldFetchProfile = isReady && isLoggedIn && hasProfileCompleteFlag;

  const { data: profileData, isLoading: isProfileLoading } =
    useGetProfile(shouldFetchProfile);

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) return;
    if (hasProfileCompleteFlag) return;

    router.replace("/profile");
  }, [isReady, isLoggedIn, hasProfileCompleteFlag, router]);

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

  if (isReady && isLoggedIn && !hasProfileCompleteFlag) return null;

  if (isProfileLoading) {
    return (
      <main className="mypagePage">
        <div className="profileCard profileCardLoading">로딩 중...</div>
      </main>
    );
  }

  const hasExistingProfile = Boolean(profileData?.profile);
  const isEditMode = mypageForm.isEditing;

  return (
    <main className="mypagePage">
      <div className="profileCard">
        {!isEditMode && (
          <ProfileHeader
            profileData={profileData}
            mypageForm={mypageForm}
            hasExistingProfile={hasExistingProfile}
          />
        )}

        {isEditMode && hasExistingProfile ? (
          <ProfileForm
            profileData={profileData}
            mypageForm={mypageForm}
            hasExistingProfile
            isUpdating={isUpdating}
            onProfileImageUpload={(file) => {
              uploadProfileImage(file).then((uploadedImageKey) => {
                if (!uploadedImageKey) return;
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
