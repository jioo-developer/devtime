import { ProfileHeader, ProfileForm, ProfileView } from "./components";
import {
  useGetProfileSuspense,
  useUpdateProfile,
  useUploadProfileImage,
  useMypageForm,
} from "./hooks";
import { useState } from "react";

export function MypageContent() {
  const { data: profileData } = useGetProfileSuspense();
  const [isEditing, setIsEditing] = useState(false);
  const { upload: uploadProfileImage } = useUploadProfileImage();
  const { mutate: updateProfileMutation, isPending: isUpdating } =
    useUpdateProfile();

  const mypageForm = useMypageForm(
    profileData,
    isEditing,
    setIsEditing,
    updateProfileMutation,
  );

  const hasExistingProfile = Boolean(profileData?.profile);
  const isEditMode = mypageForm.isEditing;

  const handleProfileImageUpload = async (file: File) => {
    const uploadedImageKey = await uploadProfileImage(file);
    if (!uploadedImageKey) return;
    mypageForm.setValue("profileImage", uploadedImageKey);
  };

  const shouldShowHeader = !isEditMode;
  const shouldShowEditForm = isEditMode && hasExistingProfile;

  return (
    <div className="profileCard">
      {shouldShowHeader && (
        <ProfileHeader
          profileData={profileData}
          mypageForm={mypageForm}
          hasExistingProfile={hasExistingProfile}
        />
      )}

      {shouldShowEditForm ? (
        <ProfileForm
          profileData={profileData}
          mypageForm={mypageForm}
          hasExistingProfile
          isUpdating={isUpdating}
          onProfileImageUpload={handleProfileImageUpload}
        />
      ) : (
        <ProfileView profileData={profileData} />
      )}
    </div>
  );
}
