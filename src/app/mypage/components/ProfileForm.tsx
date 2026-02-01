"use client";

import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonAutocomplete from "@/components/modules/CommonAutoComplate/CommonAutoComplate";
import ImageUploader from "@/components/modules/CommonImageUploder/ImageUploder";
import {
  CAREER_OPTIONS,
  PURPOSE_OPTIONS,
  TECH_STACK_OPTIONS,
} from "../constants";
import type { GetProfileResponse } from "../types";
import type { MypageFormReturn } from "../hooks";

type ProfileFormProps = {
  profileData: GetProfileResponse | undefined;
  mypageForm: MypageFormReturn;
  hasExistingProfile: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  onProfileImageUpload: (file: File) => void;
};

export function ProfileForm({
  profileData,
  mypageForm,
  hasExistingProfile,
  isCreating,
  isUpdating,
  onProfileImageUpload,
}: ProfileFormProps) {
  const selectedTechStacks = mypageForm.watch("techStacks");

  return (
      <form
      className="profileForm"
      onSubmit={mypageForm.handleSave}
      noValidate
    >
      <section className="profileSection">
        <span className="profileSectionLabel">프로필 이미지</span>
        <ImageUploader
          label=""
          onImageChange={(file) => file && onProfileImageUpload(file)}
        />
      </section>
      <section className="profileSection">
        <span className="profileSectionLabel">이메일 주소</span>
        <p className="profileSectionValue profileSectionValueReadOnly">
          {profileData?.email ?? "—"}
        </p>
      </section>

      <section className="profileSection">
        <span className="profileSectionLabel">개발 경력</span>
        <select
          className="profileFormSelect"
          {...mypageForm.register("career")}
        >
          <option value="">선택하세요</option>
          {CAREER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <section className="profileSection">
        <span className="profileSectionLabel">공부 목적</span>
        <select
          className="profileFormSelect"
          {...mypageForm.register("purpose")}
        >
          <option value="">선택하세요</option>
          {PURPOSE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <section className="profileSection profileSectionAutocomplete">
        <span className="profileSectionLabel">개발 스택</span>
        <CommonAutocomplete
          label=""
          placeholder="기술 스택을 선택하거나 입력 후 추가"
          options={TECH_STACK_OPTIONS}
          multiSelect
          showAddButton
          selectedItems={selectedTechStacks ?? []}
          onSelectedItemsChange={(newSelectedTechStacks) =>
            mypageForm.setValue("techStacks", newSelectedTechStacks)
          }
        />
      </section>

      <div className="profileFormActions">
        <CommonButton
          type="button"
          theme="tertiary"
          onClick={mypageForm.handleCancel}
          width="auto"
          className="profileFormButton profileFormButtonCancel"
          disabled={isCreating}
        >
          취소
        </CommonButton>
        <CommonButton
          type="submit"
          theme="primary"
          disabled={isUpdating || isCreating}
          width="auto"
          className="profileFormButton profileFormButtonSave"
        >
          {!hasExistingProfile
            ? isCreating
              ? "프로필 만들기 중..."
              : "프로필 만들기"
            : isUpdating
              ? "변경 사항 저장 중..."
              : "변경 사항 저장하기"}
        </CommonButton>
      </div>
    </form>
  );
}
