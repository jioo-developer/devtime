"use client";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonAutocomplete from "@/components/modules/CommonAutoComplate/CommonAutoComplate";
import CommonDropdown from "@/components/modules/CommonDropdown/CommonDropdown";
import ImageUploader from "@/components/modules/CommonImageUploder/ImageUploder";
import { useTechStacks } from "@/app/profile/hooks/useTechStacks";
import { useCreateTechStack } from "@/app/profile/hooks/useCreateTechStack";
import type { GetProfileResponse } from "../types";
import type { MypageFormReturn } from "../hooks";
import { QueryClient } from "@tanstack/react-query";
import { QueryKey } from "@/constant/queryKeys";
import {
  useCheckNickname,
  type CheckNicknameResponse,
} from "@/app/auth/hooks/useCheckNickname";
import {
  CAREER_OPTIONS,
  PURPOSE_OPTIONS_WITH_OTHER,
  PURPOSE_OTHER_VALUE,
  getProfileImageUrl,
} from "../constants";

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
  const { mutate: createTechStack } = useCreateTechStack();
  const { data: techStackOptions = [] } = useTechStacks();
  const selectedTechStacks = mypageForm.watch("techStacks");
  const currentProfileImage = mypageForm.watch("profileImage");
  const nicknameVerified = mypageForm.watch("nicknameVerified") ?? "";

  const { mutate: checkNickname } = useCheckNickname();

  const handleCheckNickname = () => {
    const nicknameValue = mypageForm.watch("nickname");
    if (!nicknameValue) return;
    mypageForm.setValue("nicknameVerified", "");
    checkNickname(nicknameValue, {
      onSuccess: (data: CheckNicknameResponse) => {
        if (!data.available) {
          mypageForm.setError("nickname", {
            type: "manual",
            message: data.message || "이미 사용 중인 닉네임입니다.",
          });
        } else {
          mypageForm.clearErrors("nickname");
          mypageForm.setValue("nicknameVerified", "사용 가능한 닉네임입니다.");
        }
      },
      onError: () => {
        mypageForm.setError("nickname", {
          type: "manual",
          message: "닉네임 중복 체크에 실패했습니다.",
        });
      },
    });
  };

  const handleAddTechStack = (inputValue: string) => {
    const value = inputValue.trim();
    if (!value) return;

    const isDuplicate = techStackOptions.some(
      ({ label }) => label.toLowerCase() === value.toLowerCase(),
    );
    if (isDuplicate) return;

    createTechStack(
      { name: value },
      {
        onSuccess: () => {
          const queryClient = new QueryClient();
          queryClient.invalidateQueries({ queryKey: [QueryKey.TECH_STACKS] });
        },
        onError: (err) => {
          console.error(`기술 스택 추가에 실패하였습니다.\n${err.message}`);
        },
      },
    );
  };

  return (
    <form className="profileForm" onSubmit={mypageForm.handleSave} noValidate>
      <div className="profileFormColumns">
        <div className="profileFormLeft">
          <section className="profileSection">
            <span className="profileSectionLabel">프로필 이미지</span>
            <ImageUploader
              label=""
              alt="현재 프로필"
              previewAlt="프로필 미리보기"
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
                error={mypageForm.errors.nickname}
                success={nicknameVerified}
                className="profileFormInput"
              />
              <CommonButton
                type="button"
                theme="overlap"
                width={104.6}
                height={44}
                onClick={handleCheckNickname}
              >
                중복 확인
              </CommonButton>
            </div>
          </section>

          <section className="profileSection">
            <span className="profileSectionLabel">공부 목적</span>
            <CommonDropdown
              label=""
              placeholder="선택하세요"
              options={PURPOSE_OPTIONS_WITH_OTHER}
              value={mypageForm.watch("purpose")}
              onChange={(value) => mypageForm.setValue("purpose", value)}
              className="profileFormSelect"
            />
            {mypageForm.watch("purpose") === PURPOSE_OTHER_VALUE && (
              <div className="profileFormPurposeDetailWrap">
                <CommonInput
                  id="purposeDetail"
                  type="text"
                  label=""
                  placeholder="공부 목적을 입력해 주세요."
                  register={mypageForm.register}
                  className="profileFormInput"
                />
              </div>
            )}
          </section>

          <section className="profileSection">
            <CommonInput
              id="newPassword"
              type="password"
              label="새 비밀번호"
              placeholder="새 비밀번호를 입력해 주세요."
              register={mypageForm.register}
              error={mypageForm.errors.newPassword}
              className="profileFormInput"
            />
          </section>
          <section className="profileSection">
            <CommonInput
              id="newPasswordConfirmation"
              testId="new-password-confirmation-input"
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요."
              register={mypageForm.register}
              error={mypageForm.errors.newPasswordConfirmation}
              className="profileFormInput"
            />
          </section>
        </div>

        <div className="profileFormRight">
          <section className="profileSection">
            <span className="profileSectionLabel">개발 경력</span>
            <CommonDropdown
              label=""
              placeholder="선택하세요"
              options={CAREER_OPTIONS}
              value={mypageForm.watch("career")}
              onChange={(value) => mypageForm.setValue("career", value)}
              className="profileFormSelect"
            />
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
              options={techStackOptions}
              multiSelect
              showAddButton
              selectedItems={selectedTechStacks ?? []}
              onAddNew={handleAddTechStack}
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
          {isUpdating ? "변경 사항 저장 중..." : "변경 사항 저장하기"}
        </CommonButton>
      </div>
    </form>
  );
}
