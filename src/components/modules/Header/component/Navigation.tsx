"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../style.module.css";

type NavigationProps = {
  isLoggedIn: boolean;
};

function Navigation({ isLoggedIn }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav>
      {isLoggedIn ? (
        <ul className={styles.navigation}>
          <li>
            <Link
              href="/dashboard"
              className={pathname === "/dashboard" ? styles.active : undefined}
            >
              대시보드
            </Link>
          </li>
          <li>
            <Link
              href="/ranking"
              className={pathname === "/ranking" ? styles.active : undefined}
            >
              랭킹
            </Link>
          </li>
        </ul>
      ) : null}
    </nav>
  );
}

export default Navigation;
