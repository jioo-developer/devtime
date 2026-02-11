"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { getCreateProfilePayload } from "@/app/profile/utils/payload";
import { setProfileComplete } from "@/app/profile/utils/localStorage";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonAutocomplete from "@/components/modules/CommonAutoComplate/CommonAutoComplate";
import CommonDropdown from "@/components/modules/CommonDropdown/CommonDropdown";
import ImageUploader from "@/components/modules/CommonImageUploder/ImageUploder";
import { useModalStore } from "@/store/modalStore";
import { useCreateProfile } from "@/app/profile/hooks/useCreateProfile";
import { useUploadProfileImage } from "@/app/mypage/hooks";
import { getProfileImageUrl } from "@/app/mypage/constants";
import { isProfileFormIncomplete } from "./utils/validation";
import type { ProfileFormData } from "@/app/profile/types";
import {
  CAREER_OPTIONS,
  PURPOSE_OPTIONS_WITH_OTHER,
  PURPOSE_OTHER_VALUE,
  TECH_STACK_OPTIONS,
} from "@/app/profile/constants/constants";
import Background from "@/asset/images/logo_background.jpg";
import Logo from "@/asset/images/Logo.svg";
import DEFAULT_PROFILE_IMAGE from "@/asset/images/default_profile_image.svg";
import "./style.css";

const DefaultFormData: ProfileFormData = {
  nickname: "",
  goal: "",
  career: "",
  purpose: "",
  purposeDetail: "",
  techStacks: [],
  profileImage: "",
};

export default function Client() {
  const router = useRouter();
  const {
    register,
    watch: formWatch,
    setValue,
    handleSubmit,
  } = useForm<ProfileFormData>({
    defaultValues: DefaultFormData,
    mode: "onChange",
  });
  const openModal = useModalStore((state) => state.push);
  const closeModal = useModalStore((state) => state.closeTop);
  const { mutate: createProfile } = useCreateProfile();
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
      return;
    }

    const payload = getCreateProfilePayload(formData);
    createProfile(payload, {
      onSuccess: () => {
        setProfileComplete();
        router.replace("/");
      },
      onError: (error) => console.error(error),
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
          <div className="profileSettingField">
            <CommonDropdown
              label="개발 경력"
              placeholder="선택하세요"
              options={CAREER_OPTIONS}
              value={formWatch("career")}
              onChange={(value) => setValue("career", value)}
              className="profileSettingDropdown"
            />
          </div>

          <div className="profileSettingField">
            <CommonDropdown
              label="공부 목적"
              placeholder="선택하세요"
              options={PURPOSE_OPTIONS_WITH_OTHER}
              value={formWatch("purpose")}
              onChange={(value) => setValue("purpose", value)}
              className="profileSettingDropdown"
            />
            {formWatch("purpose") === PURPOSE_OTHER_VALUE && (
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
              selectedItems={formWatch("techStacks") ?? []}
              onSelectedItemsChange={(items) => setValue("techStacks", items)}
            />
          </div>

          <div>
            <span className="profileSettingLabel">프로필 이미지</span>
            <ImageUploader
              label=""
              alt="현재 프로필"
              previewAlt="프로필 미리보기"
              imageKey={formWatch("profileImage")}
              getImageUrl={getProfileImageUrl}
              defaultImageUrl={DEFAULT_PROFILE_IMAGE}
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
