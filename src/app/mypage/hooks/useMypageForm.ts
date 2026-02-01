import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type {
  CreateProfileMutation,
  GetProfileResponse,
  ProfileFormData,
  UpdateProfileMutation,
} from "../types";
import {
  getCreateProfilePayload,
  getFormDefaultValuesFromProfile,
  getUpdateProfilePayload,
} from "../utils/profileFormHandler";

export function useMypageForm(
  profileData: GetProfileResponse | undefined,
  isEditing: boolean,
  setIsEditing: (value: boolean) => void,
  createProfileMutation: CreateProfileMutation,
  updateProfileMutation: UpdateProfileMutation,
) {
  const hasExistingProfile = Boolean(profileData?.profile);
  const defaultValues = getFormDefaultValuesFromProfile(profileData);
  const { register, watch, setValue, handleSubmit, reset } = useForm<
    ProfileFormData
  >({ defaultValues, mode: "onChange" });

  useEffect(() => {
    if (profileData) reset(getFormDefaultValuesFromProfile(profileData));
  }, [profileData, reset]);

  const handleCancel = () => {
    if (profileData) reset(getFormDefaultValuesFromProfile(profileData));
    setIsEditing(false);
  };

  const onSubmit = (formData: ProfileFormData) => {
    const callbacks = {
      onSuccess: () => setIsEditing(false),
      onError: (error: Error) => alert(error.message),
    };
    if (!hasExistingProfile) {
      createProfileMutation(
        getCreateProfilePayload(formData, profileData),
        callbacks,
      );
      return;
    }
    updateProfileMutation(
      getUpdateProfilePayload(formData, profileData),
      callbacks,
    );
  };

  return {
    register,
    watch,
    setValue,
    handleSave: handleSubmit(onSubmit),
    handleCancel,
    isEditing,
    setIsEditing,
  };
}
