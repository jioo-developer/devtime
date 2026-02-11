"use client";
import React, { useState, useRef } from "react";
import styles from "./style.module.css";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";

interface ImageUploaderProps {
  label?: string;
  maxSize?: number; // MB
  acceptedFormats?: string[];
  /** 기존 이미지 URL 직접 전달 (imageKey 미사용 시) */
  currentImageUrl?: string;
  /** 저장된 이미지 키 → imageKey + getImageUrl 사용 시 표시 URL을 컴포넌트 내부에서 계산 (키/URL 없으면 defaultImageUrl) */
  imageKey?: string;
  getImageUrl?: (key: string) => string;
  defaultImageUrl?: string;
  /** 표시 중인 이미지의 대체 텍스트 */
  alt?: string;
  /** 미리보기 이미지의 대체 텍스트 */
  previewAlt?: string;
  /** 미리보기/표시 이미지 너비 (px) */
  imageWidth?: number;
  /** 미리보기/표시 이미지 높이 (px) */
  imageHeight?: number;
  onImageChange?: (file: File | null) => void;
}

function ImageUploader({
  label = "Label",
  maxSize = 5,
  acceptedFormats = [".png", ".jpg", ".jpeg"],
  currentImageUrl,
  imageKey,
  getImageUrl,
  defaultImageUrl,
  alt = "이미지",
  previewAlt = "미리보기",
  imageWidth = 200,
  imageHeight = 200,
  onImageChange,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trimmedImageKey = imageKey?.trim();

  const displayUrl =
    trimmedImageKey && getImageUrl
      ? getImageUrl(trimmedImageKey)?.trim() || defaultImageUrl
      : currentImageUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크
      if (file.size > maxSize * 1024 * 1024) {
        alert(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
        return;
      }

      // 파일 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onImageChange?.(file);
    }
  };

  return (
    <div className={styles.imageUploadField}>
      <label className={styles.fieldLabel}>{label}</label>

      <div className={styles.fieldRow}>
        <div
          className={styles.uploadBox}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={handleFileChange}
            className={styles.fileInput}
          />

          {preview ? (
            <CommonImage
              className={styles.uploadPreview}
              src={preview}
              alt={previewAlt}
              width={imageWidth}
              height={imageHeight}
            />
          ) : displayUrl ? (
            <CommonImage
              className={styles.uploadPreview}
              src={displayUrl}
              alt={alt}
              width={imageWidth}
              height={imageHeight}
            />
          ) : (
            <span className={styles.uploadPlus}>+</span>
          )}
        </div>

        <p className={styles.helperText}>
          {maxSize}MB 미만의 {acceptedFormats.join(", ")} 파일
        </p>
      </div>
    </div>
  );
}

export default ImageUploader;
