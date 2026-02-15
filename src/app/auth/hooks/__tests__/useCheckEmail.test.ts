import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCheckEmail } from "../useCheckEmail";
import { createTestQueryClient, createWrapper } from "./test-utils";
import { ApiClient } from "@/config/apiConfig/apiConfig";

vi.mock("@/config/apiConfig", () => ({
  ApiClient: {
    get: vi.fn(),
  },
}));

describe("useCheckEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("이메일이 사용 가능할 때 응답을 반환한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockResolvedValueOnce({
      success: true,
      available: true,
      message: "사용 가능한 이메일입니다.",
    } as Awaited<ReturnType<typeof ApiClient.get>>);

    const { result } = renderHook(() => useCheckEmail(), { wrapper });

    const data = await result.current.mutateAsync("test@example.com");

    expect(ApiClient.get).toHaveBeenCalledWith("/api/signup/check-email", {
      query: { email: "test@example.com" },
    });
    expect(data).toEqual({
      success: true,
      available: true,
      message: "사용 가능한 이메일입니다.",
    });
  });

  it("이메일이 중복일 때 available: false 응답을 반환한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockResolvedValueOnce({
      success: false,
      available: false,
      message: "이미 사용 중인 이메일입니다.",
    } as Awaited<ReturnType<typeof ApiClient.get>>);

    const { result } = renderHook(() => useCheckEmail(), { wrapper });

    const data = await result.current.mutateAsync("duplicate@example.com");

    expect(data.available).toBe(false);
    expect(data.message).toBe("이미 사용 중인 이메일입니다.");
  });

  it("API 호출 실패 시 에러를 던진다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useCheckEmail(), { wrapper });

    await expect(
      result.current.mutateAsync("test@example.com"),
    ).rejects.toThrow("Network Error");
  });
});
