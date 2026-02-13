/// <reference types="cypress" />

const signupEmail = "signup-e2e@example.com";
const signupNickname = "e2e닉네임";
const signupPassword = "password1"; // 8자 이상, 영문+숫자

describe("회원가입 (/auth)", () => {
  beforeEach(() => {
    cy.visit("/auth");
  });

  it("페이지가 로드된다", () => {
    cy.url().should("include", "/auth");
  });

  it("회원가입 페이지 제목이 보인다", () => {
    cy.get("title").should("contain", "회원가입");
  });

  describe("통합: 회원가입 성공 플로우", () => {
    it("이메일·닉네임 중복 확인 후 약관 동의하고 회원가입하면 성공 모달 후 /profile로 이동한다", () => {
      cy.intercept("GET", "**/api/signup/check-email*", {
        statusCode: 200,
        body: { available: true },
      }).as("checkEmail");

      cy.intercept("GET", "**/api/signup/check-nickname*", {
        statusCode: 200,
        body: { available: true },
      }).as("checkNickname");

      cy.intercept("POST", "**/api/signup", {
        statusCode: 200,
        body: {},
      }).as("signup");

      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 200,
        body: {
          success: true,
          message: "로그인 성공",
          accessToken: "e2e-access-token",
          refreshToken: "e2e-refresh-token",
          isFirstLogin: true,
          isDuplicateLogin: false,
        },
      }).as("login");

      cy.get("[data-testid=email-input]").type(signupEmail);
      cy.get("form.authForm").contains("button", "중복 확인").first().click();
      cy.wait("@checkEmail");
      cy.contains("사용 가능한 이메일입니다.").should("be.visible");

      cy.get("[data-testid=nickname-input]").type(signupNickname);
      cy.get("form.authForm").contains("button", "중복 확인").last().click();
      cy.wait("@checkNickname");
      cy.contains("사용 가능한 닉네임입니다.").should("be.visible");

      cy.get("[data-testid=password-input]").type(signupPassword);
      cy.get("[data-testid=password-confirmation-input]").type(signupPassword);

      cy.get("[data-testid=agreement]").click();

      cy.get("form.authForm").contains("button", "회원가입").click();

      cy.wait("@signup").then((interception) => {
        expect(interception.request.body).to.deep.include({
          email: signupEmail,
          nickname: signupNickname,
          password: signupPassword,
          confirmPassword: signupPassword,
        });
      });
      cy.wait("@login");

      cy.contains("회원가입 성공").should("be.visible");
      cy.contains("회원가입이 완료되었습니다.").should("be.visible");
      cy.contains("button", "확인").click();
      cy.url().should("include", "/profile");
    });
  });
});
