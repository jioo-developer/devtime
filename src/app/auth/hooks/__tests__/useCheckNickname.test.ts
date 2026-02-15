import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCheckNickname } from "../useCheckNickname";
import { createTestQueryClient, createWrapper } from "./test-utils";
import { ApiClient } from "@/config/apiConfig/apiConfig";

vi.mock("@/config/apiConfig", () => ({
  ApiClient: {
    get: vi.fn(),
  },
}));

describe("useCheckNickname", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("닉네임이 사용 가능할 때 응답을 반환한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockResolvedValueOnce({
      success: true,
      available: true,
      message: "사용 가능한 닉네임입니다.",
    } as Awaited<ReturnType<typeof ApiClient.get>>);

    const { result } = renderHook(() => useCheckNickname(), { wrapper });

    const data = await result.current.mutateAsync("테스트닉네임");

    expect(ApiClient.get).toHaveBeenCalledWith("/api/signup/check-nickname", {
      query: { nickname: "테스트닉네임" },
    });
    expect(data).toEqual({
      success: true,
      available: true,
      message: "사용 가능한 닉네임입니다.",
    });
  });

  it("닉네임이 중복일 때 available: false 응답을 반환한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockResolvedValueOnce({
      success: false,
      available: false,
      message: "이미 사용 중인 닉네임입니다.",
    } as Awaited<ReturnType<typeof ApiClient.get>>);

    const { result } = renderHook(() => useCheckNickname(), { wrapper });

    const data = await result.current.mutateAsync("중복닉네임");

    expect(data.available).toBe(false);
    expect(data.message).toBe("이미 사용 중인 닉네임입니다.");
  });

  it("응답에 메시지가 없을 때 available: false를 반환한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockResolvedValueOnce({
      success: false,
      available: false,
      message: "",
    } as Awaited<ReturnType<typeof ApiClient.get>>);

    const { result } = renderHook(() => useCheckNickname(), { wrapper });

    const data = await result.current.mutateAsync("중복닉네임");

    expect(data.available).toBe(false);
    expect(data.message).toBe("");
  });

  it("API 호출 실패 시 에러를 던진다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useCheckNickname(), { wrapper });

    await expect(result.current.mutateAsync("테스트닉네임")).rejects.toThrow(
      "Network Error",
    );
  });
});
