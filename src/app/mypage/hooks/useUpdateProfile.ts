import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";
import { QueryKey } from "@/constant/queryKeys";
import type { ApiRequest, ApiResponse } from "@/types/api/helpers";

/** PUT /api/profile 요청 (generated.ts 기반) */
export type UpdateProfileRequest = ApiRequest<"/api/profile", "put">;

/** PUT /api/profile 200 응답 (generated.ts 기반) */
export type UpdateProfileResponse = ApiResponse<"/api/profile", "put", 200>;

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<UpdateProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: (updateProfilePayload) =>
      AuthenticatedApiClient.put("/api/profile", updateProfilePayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] });
    },
  });
}
