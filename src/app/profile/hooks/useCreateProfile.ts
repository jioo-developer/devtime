import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";
import { QueryKey } from "@/constant/queryKeys";
import type { ApiRequest, ApiResponse } from "@/types/api/helpers";

/** POST /api/profile 200 응답 (generated.ts 기반) */
export type CreateProfileResponse = ApiResponse<"/api/profile", "post", 200>;

export function useCreateProfile() {
  const queryClient = useQueryClient();
  return useMutation<
    CreateProfileResponse,
    Error,
    ApiRequest<"/api/profile", "post">
  >({
    mutationFn: (payload) =>
      AuthenticatedApiClient.post("/api/profile", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] });
    },
  });
}
