"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonAutocomplete from "@/components/modules/CommonAutoComplate/CommonAutoComplate";
import ImageUploader from "@/components/modules/CommonImageUploder/ImageUploder";
import Logo from "@/asset/images/Logo.svg";
import Background from "@/asset/images/logo_background.jpg";
import {
  CAREER_OPTIONS,
  getProfileImageUrl,
  PURPOSE_OPTIONS_WITH_OTHER,
  PURPOSE_OTHER_VALUE,
  TECH_STACK_OPTIONS,
} from "@/app/mypage/constants";
import { useCreateProfile, useUploadProfileImage } from "@/app/mypage/hooks";
import { getCreateProfilePayload } from "@/app/mypage/utils/profileFormHandler";
import type { ProfileFormData } from "@/app/mypage/types";
import { isProfileFormIncomplete } from "./utils/profileFormValidation";
import { useProfileModals } from "./hooks/useProfileModal";
import "./style.css";

const PROFILE_SETTING_DEFAULTS: ProfileFormData = {
  nickname: "",
  goal: "",
  career: "",
  purpose: "",
  purposeDetail: "",
  techStacks: [],
  profileImage: "",
};

export default function ProfileSettingClient() {
  const router = useRouter();
  const { register, watch, setValue, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: PROFILE_SETTING_DEFAULTS,
    mode: "onChange",
  });
  const { mutate: createProfile, isPending: isCreating } = useCreateProfile();
  const { upload: uploadProfileImage } = useUploadProfileImage();
  const { showValidationErrorModal, showCreateErrorModal } = useProfileModals();

  const selectedTechStacks = watch("techStacks");
  const currentProfileImage = watch("profileImage");

  const onSubmit = (formData: ProfileFormData) => {
    if (isProfileFormIncomplete(formData)) {
      showValidationErrorModal();
      return;
    }

    const payload = getCreateProfilePayload(formData, undefined);
    createProfile(payload, {
      onSuccess: () => router.replace("/"),
      onError: (error) => showCreateErrorModal(error.message),
    });
  };

  return (
    <main className="profileSettingLayout">
      <section className="section logoSection">
        <CommonImage
          src={Background}
          alt="서비스 로고 백그라운드"
          fill
          className="background"
        />
        <div className="content">
          <CommonImage
            src={Logo}
            alt="서비스 로고"
            width={264}
            height={200}
            className="logo"
          />
          <p className="contentText">개발자를 위한 타이머</p>
        </div>
      </section>

      <section className="section formSection">
        <h2 className="formTitle">프로필 설정</h2>
        <form
          className="profileSettingForm"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <span className="profileSettingLabel">개발 경력</span>
            <select className="profileSettingSelect" {...register("career")}>
              <option value="">선택하세요</option>
              {CAREER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="profileSettingLabel">공부 목적</span>
            <select className="profileSettingSelect" {...register("purpose")}>
              <option value="">선택하세요</option>
              {PURPOSE_OPTIONS_WITH_OTHER.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {watch("purpose") === PURPOSE_OTHER_VALUE && (
              <div className="profileSettingPurposeDetailWrap">
                <input
                  type="text"
                  className="profileSettingInput"
                  placeholder="공부 목적을 입력해 주세요."
                  {...register("purposeDetail")}
                />
              </div>
            )}
          </div>

          <div>
            <span className="profileSettingLabel">공부 목표</span>
            <input
              type="text"
              className="profileSettingInput"
              placeholder="슈퍼 개발자가 돼서 지구 정복"
              {...register("goal")}
            />
          </div>

          <div>
            <span className="profileSettingLabel">
              공부/사용 중인 기술 스택
            </span>
            <CommonAutocomplete
              label=""
              placeholder="기술 스택을 검색해 등록해 주세요."
              options={TECH_STACK_OPTIONS}
              multiSelect
              showAddButton
              selectedItems={selectedTechStacks ?? []}
              onSelectedItemsChange={(items) => setValue("techStacks", items)}
            />
          </div>

          <div>
            <span className="profileSettingLabel">프로필 이미지</span>
            <ImageUploader
              label=""
              currentImageUrl={
                currentProfileImage
                  ? getProfileImageUrl(currentProfileImage)
                  : undefined
              }
              onImageChange={(file) => {
                if (file) {
                  uploadProfileImage(file).then((key) => {
                    if (key) setValue("profileImage", key);
                  });
                }
              }}
            />
          </div>

          <div className="profileSettingActions">
            <CommonButton
              type="submit"
              theme="primary"
              width="100%"
              disabled={isCreating}
            >
              {isCreating ? "저장 중..." : "저장하기"}
            </CommonButton>
          </div>
        </form>
      </section>
    </main>
  );
}
