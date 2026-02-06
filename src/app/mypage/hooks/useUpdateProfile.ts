import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/authenticatedApiClient";
import { QueryKey } from "@/constant/queryKeys";
import type { UpdateProfileRequest, ProfileSuccessResponse } from "../types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation<ProfileSuccessResponse, Error, UpdateProfileRequest>({
    mutationFn: (updateProfilePayload) =>
      AuthenticatedApiClient.put("/api/profile", updateProfilePayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] });
    },
  });
}
