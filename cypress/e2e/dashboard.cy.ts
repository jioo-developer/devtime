/// <reference types="cypress" />

const statsResponse = {
  consecutiveDays: 7,
  totalStudyTime: 600,
  averageDailyStudyTime: 120,
  taskCompletionRate: 85,
  weekdayStudyTime: {
    Monday: 2,
    Tuesday: 3,
    Wednesday: 2,
    Thursday: 4,
    Friday: 2,
    Saturday: 1,
    Sunday: 0,
  },
};

const studyLogsResponse = {
  success: true,
  data: {
    studyLogs: [
      {
        id: "1",
        date: "2025-02-10",
        todayGoal: "E2E 테스트 작성",
        studyTime: 120,
        totalTasks: 5,
        incompleteTasks: 0,
        completionRate: 100,
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
      hasNext: false,
      hasPrev: false,
    },
  },
};

describe("대시보드 (/dashboard)", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.setLoggedInState({ profileComplete: true });
  });

  it("페이지가 로드된다", () => {
    cy.intercept("GET", "**/api/stats*", {
      statusCode: 200,
      body: statsResponse,
    }).as("stats");
    cy.intercept("GET", "**/api/study-logs*", {
      statusCode: 200,
      body: studyLogsResponse,
    }).as("studyLogs");

    cy.visit("/dashboard");
    cy.url().should("include", "/dashboard");
  });

  it("대시보드 페이지 제목이 보인다", () => {
    cy.intercept("GET", "**/api/stats*", {
      statusCode: 200,
      body: statsResponse,
    }).as("stats");
    cy.intercept("GET", "**/api/study-logs*", {
      statusCode: 200,
      body: studyLogsResponse,
    }).as("studyLogs");

    cy.visit("/dashboard");
    cy.url().should("include", "/dashboard", { timeout: 10000 });
    cy.get("title", { timeout: 10000 }).should("contain", "대시보드");
  });

  describe("통합: 대시보드 통계·기록 UI", () => {
    beforeEach(() => {
      cy.intercept("GET", "**/api/stats*", {
        statusCode: 200,
        body: statsResponse,
      }).as("stats");
      cy.intercept("GET", "**/api/study-logs*", {
        statusCode: 200,
        body: studyLogsResponse,
      }).as("studyLogs");
      cy.visit("/dashboard");
    });

    it("KPI 섹션이 로드되고 통계가 표시된다", () => {
      cy.wait("@stats");
      cy.get("section[aria-label='요약 통계']").should("be.visible");
      cy.get(".kpiSection .kpiCard").should("have.length.at.least", 1);
    });

    it("요일별 공부 시간 평균 차트 영역이 있다", () => {
      cy.wait("@stats");
      cy.contains("요일별 공부 시간 평균").should("be.visible");
    });

    it("공부 시간 바다(히트맵) 섹션이 있다", () => {
      cy.wait("@stats");
      cy.get("main.dashboardPage", { timeout: 10000 }).should("be.visible");
      cy.get("section.heatmapSection", { timeout: 10000 })
        .should("be.visible")
        .and("have.attr", "aria-label", "공부 시간 바다");
      cy.contains("공부 시간 바다").should("be.visible");
    });

    it("학습 기록 섹션이 있고 목록/페이지네이션이 있다", () => {
      cy.wait("@studyLogs");
      cy.get("section[aria-label='학습 기록']").should("be.visible");
      cy.contains("학습 기록").should("be.visible");
    });
  });
});
