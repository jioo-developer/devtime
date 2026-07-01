import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";
import { QueryKey } from "@/constant/queryKeys";
import type { ApiRequest, ApiResponseSuccess } from "@/types/api/helpers";

/** POST /api/profile 2xx 응답 (generated.ts 기반) */
export type CreateProfileResponse = ApiResponseSuccess<"/api/profile", "post">;

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
