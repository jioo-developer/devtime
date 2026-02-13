/// <reference types="cypress" />

describe("프로필 설정 (/profile)", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.setLoggedInState(); // profileComplete 없음 = 프로필 미완료 상태
  });

  it("페이지가 로드된다", () => {
    cy.visit("/profile");
    cy.url().should("include", "/profile");
  });

  it("프로필 설정 페이지 제목이 보인다", () => {
    cy.visit("/profile");
    cy.get("title").should("contain", "프로필");
  });

  describe("통합: 프로필 설정 폼 제출 후 홈으로 이동", () => {
    it("필수 항목 입력 후 저장하면 POST /api/profile 호출 후 홈(/)으로 이동한다", () => {
      cy.intercept("POST", "**/api/profile", { statusCode: 200, body: {} }).as(
        "createProfile",
      );
      cy.visit("/profile");

      cy.get("form.profileSettingForm").should("be.visible");

      // 개발 경력: 드롭다운 트리거(선택하세요) 클릭 후 옵션 선택
      cy.get("form.profileSettingForm")
        .contains("button", "선택하세요")
        .first()
        .click();
      cy.contains("li", "0 - 3년").click();

      // 공부 목적: 두 번째 드롭다운(공부 목적) 클릭 후 옵션 선택
      cy.get("form.profileSettingForm")
        .contains("label", "공부 목적")
        .siblings("button")
        .click();
      cy.contains("li", "취업 준비").click();

      // 공부 목표 입력
      cy.get("input#goal").type("E2E 통합 테스트 목표");

      // 저장하기 클릭
      cy.get("form.profileSettingForm").contains("button", "저장하기").click();

      cy.wait("@createProfile").then((interception) => {
        expect(interception.request.body).to.have.property("career");
        expect(interception.request.body).to.have.property("purpose");
        expect(interception.request.body).to.have.property("goal");
      });
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });
});
