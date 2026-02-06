"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { setProfileComplete } from "@/utils/profileStorage";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonAutocomplete from "@/components/modules/CommonAutoComplate/CommonAutoComplate";
import CommonDropdown from "@/components/modules/CommonDropdown/CommonDropdown";
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
import { useModalStore } from "@/store/modalStore";
import { useCreateProfile, useUploadProfileImage } from "@/app/mypage/hooks";
import { getCreateProfilePayload } from "@/app/mypage/utils/profileFormHandler";
import type { ProfileFormData } from "@/app/mypage/types";
import { isProfileFormIncomplete } from "./utils/profileFormValidation";
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
  // 라우터
  const router = useRouter();
  // 폼 상태 관리
  const { register, watch, setValue, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: PROFILE_SETTING_DEFAULTS,
    mode: "onChange",
  });
  // 모달 스토어
  const openModal = useModalStore((state) => state.push);
  const closeModal = useModalStore((state) => state.closeTop);
  // 프로필 생성 훅
  const { mutate: createProfile } = useCreateProfile();
  // 프로필 이미지 업로드 훅
  const { upload: uploadProfileImage } = useUploadProfileImage();

  const onSubmit = (formData: ProfileFormData) => {
    if (isProfileFormIncomplete(formData)) {
      openModal({
        title: "입력 오류",
        content: "모든 항목을 입력해 주세요.",
        footer: (
          <CommonButton theme="primary" onClick={() => closeModal()}>
            확인
          </CommonButton>
        ),
        BackdropMiss: false,
      });
      // 입력 오류 모달 띄우고 종료
      return;
    }

    const payload = getCreateProfilePayload(formData, undefined);
    // 프로필 생성 요청
    createProfile(payload, {
      onSuccess: () => {
        setProfileComplete();
        router.replace("/");
      },
      onError: (error) => console.error(error),
    });
    // 프로필 생성 실패 시 에러 콘솔 출력
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
          <div className="profileSettingField">
            <CommonDropdown
              label="개발 경력"
              placeholder="선택하세요"
              options={CAREER_OPTIONS}
              value={watch().career}
              onChange={(value) => setValue("career", value)}
              className="profileSettingDropdown"
            />
          </div>

          <div className="profileSettingField">
            <CommonDropdown
              label="공부 목적"
              placeholder="선택하세요"
              options={PURPOSE_OPTIONS_WITH_OTHER}
              value={watch().purpose}
              onChange={(value) => setValue("purpose", value)}
              className="profileSettingDropdown"
            />
            {watch().purpose === PURPOSE_OTHER_VALUE && (
              <div className="profileSettingPurposeDetailWrap">
                <CommonInput<ProfileFormData>
                  id="purposeDetail"
                  label=""
                  placeholder="공부 목적을 입력해 주세요."
                  register={register}
                  className="profileSettingInput"
                />
              </div>
            )}
          </div>

          <div className="profileSettingField">
            <CommonInput<ProfileFormData>
              id="goal"
              label="공부 목표"
              placeholder="슈퍼 개발자가 돼서 지구 정복"
              register={register}
              className="profileSettingInput"
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
              selectedItems={watch().techStacks ?? []}
              onSelectedItemsChange={(items) => setValue("techStacks", items)}
            />
          </div>

          <div>
            <span className="profileSettingLabel">프로필 이미지</span>
            <ImageUploader
              label=""
              currentImageUrl={
                getProfileImageUrl(watch().profileImage) || undefined
              }
              onImageChange={(file) => {
                if (!file) return;

                uploadProfileImage(file).then((key) => {
                  if (!key) return;
                  setValue("profileImage", key);
                });
              }}
            />
          </div>

          <div className="profileSettingActions">
            <CommonButton type="submit" theme="primary" width="100%">
              저장하기
            </CommonButton>
          </div>
        </form>
      </section>
    </main>
  );
}
