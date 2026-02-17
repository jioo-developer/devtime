import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Client from "./Client";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/atoms/CommonImage/CommonImage", () => ({
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));

describe("resetPassword Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("초기 렌더링", () => {
    it("비밀번호 찾기 제목과 설명이 표시된다", () => {
      render(<Client />);

      expect(
        screen.getByRole("heading", { name: "비밀번호 찾기" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/가입 시 사용한 이메일 주소를 입력하시면/),
      ).toBeInTheDocument();
    });

    it("이메일 입력 필드가 렌더링된다", () => {
      render(<Client />);

      const input = screen.getByTestId("reset-password-email-input");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "email");
      expect(
        screen.getByPlaceholderText("이메일 주소를 입력해 주세요."),
      ).toBeInTheDocument();
    });

    it("재설정 링크 받기 버튼이 렌더링된다", () => {
      render(<Client />);

      expect(
        screen.getByRole("button", { name: "재설정 링크 받기" }),
      ).toBeInTheDocument();
    });

    it("로그인으로 돌아가기 링크가 /login을 가리킨다", () => {
      render(<Client />);

      const link = screen.getByRole("link", { name: "로그인으로 돌아가기" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/login");
    });

    it("이메일 미입력 시 제출 버튼이 비활성화되어 있다", () => {
      render(<Client />);

      expect(
        screen.getByRole("button", { name: "재설정 링크 받기" }),
      ).toBeDisabled();
    });
  });

  describe("이메일 유효성", () => {
    it("올바른 이메일 입력 시 제출 버튼이 활성화된다", async () => {
      const user = userEvent.setup();
      render(<Client />);

      const input = screen.getByTestId("reset-password-email-input");
      await user.type(input, "test@example.com");

      expect(
        screen.getByRole("button", { name: "재설정 링크 받기" }),
      ).not.toBeDisabled();
    });

    it("잘못된 이메일 형식 입력 시 에러 메시지가 표시된다", async () => {
      const user = userEvent.setup();
      render(<Client />);

      const input = screen.getByTestId("reset-password-email-input");
      await user.type(input, "invalid-email");
      await user.tab();

      expect(
        screen.getByText("이메일 형식으로 작성해 주세요."),
      ).toBeInTheDocument();
    });

    it("이메일을 비운 뒤 포커스 아웃 시 필수 에러가 표시된다", async () => {
      const user = userEvent.setup();
      render(<Client />);

      const input = screen.getByTestId("reset-password-email-input");
      await user.type(input, "a@a.com");
      await user.clear(input);
      await user.tab();

      expect(screen.getByText("이메일을 입력하세요.")).toBeInTheDocument();
    });
  });

  describe("폼 제출", () => {
    const submitValidEmail = async () => {
      const input = screen.getByTestId("reset-password-email-input");
      fireEvent.change(input, { target: { value: "user@example.com" } });
      fireEvent.click(screen.getByRole("button", { name: "재설정 링크 받기" }));
      await waitFor(() => {
        expect(screen.getByText("이메일을 확인해 주세요")).toBeInTheDocument();
      });
    };

    it("유효한 이메일로 제출 시 성공 화면이 표시된다", async () => {
      render(<Client />);

      await submitValidEmail();

      expect(
        screen.getByText(
          /입력하신 이메일 주소로 비밀번호 재설정 링크를 보냈습니다/,
        ),
      ).toBeInTheDocument();
    });

    it("성공 화면에서 로그인으로 돌아가기 버튼이 /login을 가리킨다", async () => {
      render(<Client />);

      await submitValidEmail();

      const loginLink = screen.getByRole("link", {
        name: "로그인으로 돌아가기",
      });
      expect(loginLink).toHaveAttribute("href", "/login");
    });

    it("성공 화면에서는 입력 폼이 보이지 않는다", async () => {
      render(<Client />);

      await submitValidEmail();

      expect(
        screen.queryByPlaceholderText("이메일 주소를 입력해 주세요."),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "재설정 링크 받기" }),
      ).not.toBeInTheDocument();
    });
  });
});
