"use client";
import React from "react";
import styles from "../style.module.css";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import DefaultImage from "@/asset/images/default_profile_image.svg";
import Link from "next/link";
import { useLogout } from "@/app/login/hooks/useLogout";
import { useDropdown } from "@/components/modules/CommonDropdown/hooks/useDropdown";
import { useGetProfile } from "@/app/mypage/hooks/useGetProfile";
import { getProfileImageUrl } from "@/app/mypage/constants";
import { MdPerson, MdLogout } from "react-icons/md";

type AccountMenuProps = {
  isLoggedIn: boolean;
  hasProfile: boolean;
};

function AccountMenu({ isLoggedIn, hasProfile }: AccountMenuProps) {
  const { mutate: logout } = useLogout();
  const { isOpen, toggle, rootRef } = useDropdown<HTMLLIElement>();

  const { data: profile } = useGetProfile(isLoggedIn);
  const nickname = profile?.nickname;
  const profileImageDisplayUrl = getProfileImageUrl(
    profile?.profile?.profileImage,
  );

  const handleLogout = () => logout();

  return (
    <ul className={styles.navigation}>
      {isLoggedIn ? (
        <li ref={rootRef} className={styles.accountDropdownWrap}>
          <button
            type="button"
            className={styles.accountTrigger}
            onClick={toggle}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <CommonImage
              src={profileImageDisplayUrl || DefaultImage}
              alt="프로필"
              width={40}
              height={40}
              className={styles.accountAvatar}
            />
            <span className={styles.profileName}>{nickname || "DevTime"}</span>
          </button>
          {isOpen && (
            <div className={styles.accountMenu}>
              <Link
                href={hasProfile ? "/mypage" : "/profile"}
                className={styles.accountMenuItem}
                onClick={toggle}
              >
                <MdPerson size={20} className={styles.accountMenuIcon} />
                {hasProfile ? "마이페이지" : "프로필 설정"}
              </Link>
              <div className={styles.accountMenuDivider} />
              <button
                type="button"
                className={styles.accountMenuItem}
                onClick={handleLogout}
              >
                <MdLogout size={20} className={styles.accountMenuIcon} />
                로그아웃
              </button>
            </div>
          )}
        </li>
      ) : (
        <>
          <li>
            <Link href="/login">로그인</Link>
          </li>
          <li>
            <Link href="/auth">회원가입</Link>
          </li>
        </>
      )}
    </ul>
  );
}

export default AccountMenu;
