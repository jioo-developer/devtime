import { ProfileHeader, ProfileForm, ProfileView } from "./components";
import { useUploadProfileImage, useMypageForm } from "./hooks";

export function MypageContent() {
  const { upload: uploadProfileImage } = useUploadProfileImage();

  const mypageForm = useMypageForm({
    onUpdateError: (error) => console.error(error.message),
  });

  const { profileData, isUpdating, isEditing } = mypageForm;

  const hasExistingProfile = Boolean(profileData?.profile);
  const isEditMode = isEditing;

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
