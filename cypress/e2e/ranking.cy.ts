/// <reference types="cypress" />

describe("랭킹 (/ranking)", () => {
  beforeEach(() => {
    cy.visit("/ranking");
  });

  it("페이지가 로드된다", () => {
    cy.url().should("include", "/ranking");
  });

  it("랭킹 페이지 제목이 보인다", () => {
    cy.get("title").should("contain", "랭킹");
  });

  describe("통합: 랭킹 UI", () => {
    it("탭(총 학습 시간 / 일 평균 학습 시간)이 보인다", () => {
      cy.get("[role='tablist']").should("be.visible");
      cy.contains("button", "총 학습 시간").should("be.visible");
      cy.contains("button", "일 평균 학습 시간").should("be.visible");
    });

    it("랭킹 목록이 보인다", () => {
      cy.get(".rankingList").should("be.visible");
      cy.get("ol.rankingList li").should("have.length.at.least", 1);
    });

    it("탭을 전환해도 목록이 유지된다", () => {
      cy.contains("button", "일 평균 학습 시간").click();
      cy.get(".rankingList").should("be.visible");
      cy.contains("button", "일 평균 학습 시간").should(
        "have.attr",
        "aria-selected",
        "true",
      );
    });
  });
});
