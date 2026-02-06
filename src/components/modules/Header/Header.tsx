"use client";
import React from "react";
import HeaderLogo from "@/asset/images/header_logo.svg";
import styles from "./style.module.css";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import Navigation from "./component/Navigation";
import AccountMenu from "./component/AccountMenu";
import Link from "next/link";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { getProfileComplete } from "@/utils/profileStorage";

function Header() {
  const { isLoggedIn } = useIsLoggedIn();
  const hasProfile = getProfileComplete();

  return (
    <header className={styles.header}>
      <div className={styles.headerIn}>
        <div className={styles.leftCon}>
          <Link href="/">
            <CommonImage
              src={HeaderLogo}
              alt="로고"
              width={148}
              height={40}
              priority
            />
          </Link>
          <Navigation isLoggedIn={isLoggedIn} />
        </div>
        <div className={styles.rightCon}>
          <AccountMenu isLoggedIn={isLoggedIn} hasProfile={hasProfile} />
        </div>
      </div>
    </header>
  );
}

export default Header;
