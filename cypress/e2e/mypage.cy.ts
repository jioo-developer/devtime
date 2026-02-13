/// <reference types="cypress" />

const profileResponse = {
  email: "e2e@example.com",
  nickname: "e2e닉네임",
  profile: {
    career: "0 - 3년",
    purpose: "취업",
    techStacks: ["JavaScript", "TypeScript"],
    profileImage: "",
    goal: "E2E 테스트 마스터하기",
  },
};

describe("마이페이지 (/mypage)", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.setLoggedInState({ profileComplete: true });
  });

  it("페이지가 로드된다", () => {
    cy.intercept("GET", "**/api/profile", {
      statusCode: 200,
      body: profileResponse,
    }).as("getProfile");
    cy.visit("/mypage");
    cy.url().should("include", "/mypage");
  });

  it("마이페이지 제목이 보인다", () => {
    cy.intercept("GET", "**/api/profile", {
      statusCode: 200,
      body: profileResponse,
    }).as("getProfile");
    cy.visit("/mypage");
    cy.get("title").should("contain", "마이페이지");
  });

  describe("통합: 마이페이지 프로필 UI", () => {
    beforeEach(() => {
      cy.intercept("GET", "**/api/profile", {
        statusCode: 200,
        body: profileResponse,
      }).as("getProfile");
      cy.visit("/mypage");
    });

    it("프로필 로드 후 프로필 카드가 보인다", () => {
      cy.wait("@getProfile");
      cy.get(".profileCard").should("be.visible");
    });

    it("프로필 정보(닉네임 등)가 표시된다", () => {
      cy.wait("@getProfile");
      cy.contains(profileResponse.nickname).should("be.visible");
    });
  });
});
