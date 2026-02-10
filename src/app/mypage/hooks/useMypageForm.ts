import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type {
  GetProfileResponse,
  ProfileFormData,
  UpdateProfileMutation,
} from "../types";
import { getFormDefaultValuesFromProfile } from "../utils/getFormDefaultValuesFromProfile";
import { getUpdateProfilePayload } from "../../profile/utils/payload";

export function useMypageForm(
  profileData: GetProfileResponse | undefined,
  isEditing: boolean,
  setIsEditing: (value: boolean) => void,
  updateProfileMutation: UpdateProfileMutation,
) {
  const defaultValues = getFormDefaultValuesFromProfile(profileData);
  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({ defaultValues, mode: "onChange" });

  useEffect(() => {
    if (profileData) reset(getFormDefaultValuesFromProfile(profileData));
  }, [profileData, reset]);

  const handleCancel = () => {
    if (profileData) reset(getFormDefaultValuesFromProfile(profileData));
    setIsEditing(false);
  };

  const onSubmit = (formData: ProfileFormData) => {
    updateProfileMutation(getUpdateProfilePayload(formData, profileData), {
      onSuccess: () => setIsEditing(false),
      onError: (error: Error) => alert(error.message),
    });
  };

  return {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    errors,
    handleSave: handleSubmit(onSubmit),
    handleCancel,
    isEditing,
    setIsEditing,
  };
}
