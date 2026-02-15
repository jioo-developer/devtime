"use client";
import styles from "../asset/404.module.css";
import CommonButton from "@/atoms/CommonButton/CommonButton";

export default function NotFoundPage() {
  return (
    <div className={styles.notfoundRoot}>
      <div className={styles.notfoundWrapper}>
        <div className={styles.notfoundBg} />
        <h1 className={styles.title}>페이지를 찾을 수 없습니다.</h1>
        <CommonButton theme="primary" onClick={() => window.history.back()}>
          돌아가기
        </CommonButton>
      </div>
    </div>
  );
}
