import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { GetProfileResponse, ProfileFormData } from "../types";
import {
  PURPOSE_OTHER_VALUE,
  type PurposeFromApi,
} from "@/app/profile/constants/constants";
import { getUpdateProfilePayload } from "@/app/profile/utils/payload";
import { useGetProfileSuspense } from "./useGetProfile";
import { useUpdateProfile } from "./useUpdateProfile";

/** API purpose → 폼용 purpose, purposeDetail (프로필 상수 타입 기준) */
function apiPurposeToForm(purpose: PurposeFromApi): {
  purpose: string;
  purposeDetail: string;
} {
  if (!purpose || typeof purpose === "string") {
    return { purpose: purpose ?? "", purposeDetail: "" };
  }
  if (purpose.type === "기타") {
    return {
      purpose: PURPOSE_OTHER_VALUE,
      purposeDetail: purpose.detail ?? "",
    };
  }
  return { purpose: "", purposeDetail: "" };
}

export type UseMypageFormCallbacks = {
  onUpdateSuccess?: () => void;
  onUpdateError?: (error: Error) => void;
};

function getFormDefaultValue(
  profileData: GetProfileResponse | undefined,
): ProfileFormData {
  const { purpose, purposeDetail } = apiPurposeToForm(
    profileData?.profile?.purpose,
  );

  return {
    nickname: profileData?.nickname ?? "",
    goal: profileData?.profile?.goal ?? "",
    career: profileData?.profile?.career ?? "",
    purpose,
    purposeDetail,
    techStacks: profileData?.profile?.techStacks ?? [],
    profileImage: profileData?.profile?.profileImage ?? "",
    newPassword: "",
    newPasswordConfirmation: "",
  };
}

export function useMypageForm(callbacks?: UseMypageFormCallbacks) {
  const { data: profileData } = useGetProfileSuspense();
  const { mutate: updateProfileMutation, isPending: isUpdating } =
    useUpdateProfile();
  const { onUpdateSuccess, onUpdateError } = callbacks ?? {};
  const [isEditing, setIsEditing] = useState(false);
  const defaultValues = getFormDefaultValue(profileData);
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
    if (profileData) reset(getFormDefaultValue(profileData));
  }, [profileData, reset]);

  const handleCancel = () => {
    if (profileData) reset(getFormDefaultValue(profileData));
    setIsEditing(false);
  };

  const onSubmit = (formData: ProfileFormData) => {
    updateProfileMutation(getUpdateProfilePayload(formData, profileData), {
      onSuccess: () => {
        setIsEditing(false);
        onUpdateSuccess?.();
      },
      onError: (error: Error) => {
        onUpdateError?.(error);
      },
    });
  };

  return {
    profileData,
    isUpdating,
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
