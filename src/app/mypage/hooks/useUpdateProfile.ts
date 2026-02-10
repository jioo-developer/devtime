import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";
import { QueryKey } from "@/constant/queryKeys";
import type { UpdateProfileRequest, UpdateProfileResponse } from "../types";

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
