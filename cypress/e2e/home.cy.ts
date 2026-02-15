/// <reference types="cypress" />

describe("홈 (/)", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("페이지가 로드된다", () => {
    cy.url().should("include", "/");
  });

  it("DevTime 타이머 페이지가 보인다", () => {
    cy.get("title").should("contain", "DevTime");
  });

  describe("통합: 홈 타이머 UI", () => {
    it("타이머 컨테이너와 제목이 보인다", () => {
      cy.get("main.mainPageWrap").should("be.visible");
      cy.get(".timerContainer").should("be.visible");
      cy.get(".timerTitle").should("be.visible");
    });

    it("타이머 디스플레이(시·분·초) 영역이 있다", () => {
      cy.get(".timerContainer").within(() => {
        cy.get("[class*='timerDisplay'], [class*='display']").should("exist");
      });
    });

    it("컨트롤 버튼 영역이 있다", () => {
      cy.get(".timerContainer").within(() => {
        cy.get(".controls").should("exist");
      });
    });
  });
});
