"use client";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { PageErrorFallback } from "@/components/PageErrorFallback";
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
import type { ProfileCreateFormData } from "@/app/profile/types";
import {
  CAREER_OPTIONS,
  DefaultFormData,
  PURPOSE_OPTIONS_WITH_OTHER,
  PURPOSE_OTHER_VALUE,
} from "@/app/profile/constants/constants";
import { useTechStacks } from "@/app/profile/hooks/useTechStacks";
import { useCreateTechStack } from "@/app/profile/hooks/useCreateTechStack";
import { profileCreateSchema } from "@/schema/formSchemas";
import Background from "@/asset/images/logo_background.jpg";
import Logo from "@/asset/images/Logo.svg";
import DEFAULT_PROFILE_IMAGE from "@/asset/images/default_profile_image.svg";
import "./style.css";
import { useQueryClient } from "@tanstack/react-query";

export default function Client() {
  const router = useRouter();
  const {
    register,
    watch: formWatch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileCreateFormData>({
    resolver: zodResolver(profileCreateSchema),
    defaultValues: DefaultFormData,
    mode: "onChange",
  });
  const openModal = useModalStore((state) => state.push);
  const closeModal = useModalStore((state) => state.closeTop);
  const queryClient = useQueryClient();
  const { data: techStackOptions = [] } = useTechStacks();
  const { mutate: createTechStack } = useCreateTechStack();
  const { mutate: createProfile } = useCreateProfile();
  const { upload: uploadProfileImage } = useUploadProfileImage();

  // 프로필 이미지 변경 핸들러
  const handleImageChange = (file: File | null) => {
    if (!file) return;
    uploadProfileImage(file).then((key) => {
      if (!key) return;
      setValue("profileImage", key);
    });
  };

  const handleAddTechStack = (inputValue: string) => {
    const normalized = inputValue.trim();
    if (!normalized) return;
    const exists = techStackOptions.some(
      (option) => option.label.toLowerCase() === normalized.toLowerCase(),
    );
    if (exists) return;
    createTechStack(
      { name: normalized },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["techStacks"] });
        },
        onError: (err) => {
          console.error(`추가하는데 실패하였습니다.\n${err.message}`);
        },
      },
    );
  };

  const onSubmit = (formData: ProfileCreateFormData) => {
    const payload = getCreateProfilePayload(formData);
    createProfile(payload, {
      onSuccess: () => {
        setProfileComplete();
        router.replace("/");
        // 프로필 설정 완료
      },
      onError: (error) => {
        openModal({
          title: "프로필 설정 실패",
          content: error?.message ?? "프로필 설정에 실패했습니다.",
          footer: (
            <CommonButton theme="primary" onClick={() => closeModal()}>
              확인
            </CommonButton>
          ),
        });
      },
    });
  };

  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <PageErrorFallback
          {...props}
          message="프로필 설정을 불러오지 못했습니다."
        />
      )}
    >
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
                  <CommonInput
                    id="purposeDetail"
                    label=""
                    placeholder="공부 목적을 입력해 주세요."
                    register={register}
                    error={errors.purposeDetail}
                    className="profileSettingInput"
                  />
                </div>
              )}
            </div>

            <div className="profileSettingField">
              <CommonInput
                id="goal"
                label="공부 목표"
                placeholder="슈퍼 개발자가 돼서 지구 정복"
                register={register}
                error={errors.goal}
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
                options={techStackOptions}
                multiSelect
                showAddButton
                selectedItems={formWatch("techStacks") ?? []}
                onAddNew={handleAddTechStack}
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
                onImageChange={handleImageChange}
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
    </ErrorBoundary>
  );
}
