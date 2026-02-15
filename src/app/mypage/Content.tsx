import { ProfileHeader, ProfileForm, ProfileView } from "./components";
import { useUploadProfileImage, useMypageForm } from "./hooks";

export function MypageContent() {
  const { upload: uploadProfileImage } = useUploadProfileImage();
  const mypageForm = useMypageForm();

  const { profileData, isUpdating, isEditing } = mypageForm;
  const hasProfile = !!profileData?.profile;

  const handleProfileImageUpload = async (file: File) => {
    const imageKey = await uploadProfileImage(file);
    if (imageKey) {
      mypageForm.setValue("profileImage", imageKey);
    }
  };

  return (
    <div className="profileCard">
      {!isEditing && (
        <ProfileHeader
          profileData={profileData}
          mypageForm={mypageForm}
          hasExistingProfile={hasProfile}
        />
      )}

      {isEditing && hasProfile ? (
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
