/// <reference types="cypress" />

const TOKEN_EXPIRY_FUTURE_MS = Date.now() + 60 * 60 * 1000; // 1h
const REFRESH_EXPIRY_FUTURE_MS = Date.now() + 10 * 24 * 60 * 60 * 1000; // 10d

/**
 * 로그인 상태로 설정 (localStorage + 쿠키).
 * 반드시 한 번 이상 visit 한 뒤 같은 origin에서 호출.
 * @param options.profileComplete - true면 마이페이지 진입 가능 (프로필 완료 상태)
 */
Cypress.Commands.add(
  "setLoggedInState",
  (options?: { profileComplete?: boolean }) => {
    cy.setCookie("accessTokenExpiry", String(TOKEN_EXPIRY_FUTURE_MS));
    cy.setCookie("refreshTokenExpiry", String(REFRESH_EXPIRY_FUTURE_MS));
    cy.window().then((win) => {
      win.localStorage.setItem("accessToken", "e2e-access-token");
      win.localStorage.setItem("refreshToken", "e2e-refresh-token");
      if (options?.profileComplete) {
        win.localStorage.setItem("profileComplete", "true");
      }
    });
  },
);
