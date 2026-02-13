/// <reference types="cypress" />

const rankingsResponse = {
  success: true,
  data: {
    rankings: [
      {
        rank: 1,
        userId: "user-1",
        nickname: "E2E유저",
        totalStudyTime: 3600,
        averageStudyTime: 360,
        profile: {
          career: "0 - 3년",
          purpose: "취업 준비",
          profileImage: null,
          techStacks: [
            { id: 1, name: "JavaScript" },
            { id: 2, name: "TypeScript" },
          ],
        },
      },
      {
        rank: 2,
        userId: "user-2",
        nickname: "두번째유저",
        totalStudyTime: 1800,
        averageStudyTime: 180,
        profile: {
          career: "4 - 7년",
          purpose: "이직 준비",
          profileImage: null,
          techStacks: [{ id: 3, name: "React" }],
        },
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 2,
      totalItems: 12,
      hasNext: true,
      hasPrev: false,
    },
  },
};

describe("랭킹 (/ranking)", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/rankings*", {
      statusCode: 200,
      body: rankingsResponse,
    }).as("getRankings");
    cy.visit("/ranking");
  });

  it("페이지가 로드된다", () => {
    cy.url().should("include", "/ranking");
  });

  it("랭킹 페이지 제목이 보인다", () => {
    cy.get("title").should("contain", "랭킹");
  });

  it("탭(총 학습 시간 / 일 평균 학습 시간)이 보인다", () => {
    cy.get("[role='tablist']").should("be.visible");
    cy.contains("button", "총 학습 시간").should("be.visible");
    cy.contains("button", "일 평균 학습 시간").should("be.visible");
  });

  describe("통합: 랭킹 API 연동", () => {
    it("GET /api/rankings가 sortBy=total로 호출되고 랭킹 목록이 표시된다", () => {
      cy.wait("@getRankings").then((interception) => {
        expect(interception.request.url).to.include("sortBy=total");
      });
      cy.get("li.rankingCard", { timeout: 10000 }).should("have.length", 2);
      cy.get(".rankingList").should("be.visible");
      cy.contains("E2E유저").should("be.visible");
      cy.contains("두번째유저").should("be.visible");
    });

    it("탭을 '일 평균 학습 시간'으로 바꾸면 sortBy=avg로 재요청된다", () => {
      cy.wait("@getRankings");
      cy.contains("button", "일 평균 학습 시간").click();
      cy.wait("@getRankings").then((interception) => {
        expect(interception.request.url).to.include("sortBy=avg");
      });
    });
  });

  describe("Suspense / 스켈레톤", () => {
    it("로딩 중에는 스켈레톤이 보이고, 응답 후 실제 목록으로 바뀐다", () => {
      cy.intercept("GET", "**/api/rankings*", (req) => {
        req.reply({
          delay: 300,
          statusCode: 200,
          body: rankingsResponse,
        });
      }).as("getRankingsSlow");
      cy.visit("/ranking");

      cy.get(".rankingSkeleton", { timeout: 500 }).should("be.visible");
      cy.get("@getRankingsSlow");
      cy.get("li.rankingCard", { timeout: 10000 }).should("have.length", 2);
      cy.get(".rankingSkeleton").should("not.exist");
    });
  });
});
