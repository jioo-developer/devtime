/// <reference types="cypress" />

const validEmail = "e2e@example.com";
const validPassword = "password1"; // 8자 이상, 영문+숫자

const loginSuccessResponse = {
  success: true,
  message: "로그인 성공",
  accessToken: "e2e-access-token",
  refreshToken: "e2e-refresh-token",
  isFirstLogin: false,
  isDuplicateLogin: false,
};

describe("로그인 (/login)", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("페이지가 로드된다", () => {
    cy.url().should("include", "/login");
  });

  it("로그인 페이지 제목이 보인다", () => {
    cy.get("title").should("contain", "로그인");
  });

  describe("통합: 로그인 성공 플로우", () => {
    it("이메일·비밀번호 입력 후 로그인하면 홈(/)으로 이동한다", () => {
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 200,
        body: loginSuccessResponse,
      }).as("login");

      cy.get("[data-testid=email-input]").type(validEmail);
      cy.get("[data-testid=password-input]").type(validPassword);
      cy.get("form.loginForm").contains("button", "로그인").click();

      cy.wait("@login").then((interception) => {
        expect(interception.request.body).to.deep.equal({
          email: validEmail,
          password: validPassword,
        });
      });
      cy.url().should("match", /\/(\?.*)?$/);
    });

    it("첫 로그인(isFirstLogin: true)이면 /profile로 이동한다", () => {
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 200,
        body: {
          ...loginSuccessResponse,
          isFirstLogin: true,
        },
      }).as("login");

      cy.get("[data-testid=email-input]").type(validEmail);
      cy.get("[data-testid=password-input]").type(validPassword);
      cy.get("form.loginForm").contains("button", "로그인").click();

      cy.wait("@login");
      cy.url().should("include", "/profile");
    });
  });
});
