"use client";

import { useState } from "react";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonAutocomplete from "@/components/modules/CommonAutoComplate/CommonAutoComplate";
import ImageUploader from "@/components/modules/CommonImageUploder/ImageUploder";
import { useCheckNickname } from "@/app/auth/hooks/useCheckNickname";
import {
  CAREER_OPTIONS,
  PURPOSE_OPTIONS,
  TECH_STACK_OPTIONS,
  getProfileImageUrl,
} from "../constants";
import type { GetProfileResponse, ProfileFormData } from "../types";
import type { MypageFormReturn } from "../hooks";
import { newPasswordValidation } from "../utils/passwordValidation";

type ProfileFormProps = {
  profileData: GetProfileResponse | undefined;
  mypageForm: MypageFormReturn;
  hasExistingProfile: boolean;
  isUpdating: boolean;
  onProfileImageUpload: (file: File) => void;
};

export function ProfileForm({
  mypageForm,
  isUpdating,
  onProfileImageUpload,
}: ProfileFormProps) {
  const selectedTechStacks = mypageForm.watch("techStacks");
  const currentProfileImage = mypageForm.watch("profileImage");
  const [nicknameSuccess, setNicknameSuccess] = useState<string>("");

  const { mutate: checkNickname } = useCheckNickname<ProfileFormData>({
    setError: mypageForm.setError,
    clearErrors: mypageForm.clearErrors,
    setSuccessMessage: setNicknameSuccess,
  });

  return (
    <form
      className="profileForm"
      onSubmit={mypageForm.handleSave}
      noValidate
    >
      <div className="profileFormColumns">
        <div className="profileFormLeft">
          <section className="profileSection">
            <span className="profileSectionLabel">프로필 이미지</span>
            <ImageUploader
              label=""
              currentImageUrl={
                currentProfileImage
                  ? getProfileImageUrl(currentProfileImage)
                  : undefined
              }
              onImageChange={(file) => file && onProfileImageUpload(file)}
            />
          </section>

          <section className="profileSection">
            <span className="profileSectionLabel">닉네임</span>
            <div className="profileFormFieldWrap">
              <CommonInput
                id="nickname"
                type="text"
                label=""
                placeholder="닉네임"
                register={mypageForm.register}
                validation={{ required: "닉네임을 입력하세요." }}
                error={mypageForm.errors.nickname}
                success={nicknameSuccess}
                className="profileFormInput"
              />
              <CommonButton
                type="button"
                theme="overlap"
                width={104.6}
                height={44}
                onClick={() => {
                  const nicknameValue = mypageForm.watch("nickname");
                  if (nicknameValue) {
                    setNicknameSuccess("");
                    checkNickname(nicknameValue);
                  }
                }}
              >
                중복 확인
              </CommonButton>
            </div>
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

          <section className="profileSection">
            <CommonInput
              id="newPassword"
              type="password"
              label="새 비밀번호"
              placeholder="비밀번호를 입력해 주세요."
              register={mypageForm.register}
              validation={newPasswordValidation}
              error={mypageForm.errors.newPassword}
              className="profileFormInput"
            />
          </section>
          <section className="profileSection">
            <CommonInput
              id="newPasswordConfirmation"
              type="password"
              label="새 비밀번호 재입력"
              placeholder="비밀번호를 한 번 더 입력해 주세요."
              register={mypageForm.register}
              validation={{
                validate: (value: string | string[] | undefined) => {
                  const str = typeof value === "string" ? value : value?.[0];
                  const newPw = mypageForm.watch("newPassword");
                  if (!newPw && !str) return true;
                  return (
                    str === newPw || "비밀번호가 일치하지 않습니다."
                  );
                },
              }}
              error={mypageForm.errors.newPasswordConfirmation}
              className="profileFormInput"
            />
          </section>
        </div>

        <div className="profileFormRight">
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
            <span className="profileSectionLabel">공부 목표</span>
            <input
              type="text"
              className="profileFormInput"
              placeholder="슈퍼 개발자가 돼서 지구 정복"
              {...mypageForm.register("goal")}
            />
          </section>

          <section className="profileSection profileSectionAutocomplete">
            <span className="profileSectionLabel">
              공부/사용 중인 기술 스택(선택)
            </span>
            <CommonAutocomplete
              label=""
              placeholder="기술 스택을 검색해 등록해 주세요."
              options={TECH_STACK_OPTIONS}
              multiSelect
              showAddButton
              selectedItems={selectedTechStacks ?? []}
              onSelectedItemsChange={(newSelectedTechStacks) =>
                mypageForm.setValue("techStacks", newSelectedTechStacks)
              }
            />
          </section>
        </div>
      </div>

      <div className="profileFormActions">
        <CommonButton
          type="button"
          theme="tertiary"
          onClick={mypageForm.handleCancel}
          width="auto"
          className="profileFormButton profileFormButtonCancel"
        >
          취소
        </CommonButton>
        <CommonButton
          type="submit"
          theme="primary"
          disabled={isUpdating}
          width="auto"
          className="profileFormButton profileFormButtonSave"
        >
          {isUpdating
            ? "변경 사항 저장 중..."
            : "변경 사항 저장하기"}
        </CommonButton>
      </div>
    </form>
  );
}
