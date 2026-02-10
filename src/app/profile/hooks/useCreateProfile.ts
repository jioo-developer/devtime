import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";
import { QueryKey } from "@/constant/queryKeys";
import type {
  CreateProfileRequest,
  CreateProfileResponse,
} from "@/app/profile/types";

export function useCreateProfile() {
  const queryClient = useQueryClient();
  return useMutation<CreateProfileResponse, Error, CreateProfileRequest>({
    mutationFn: (createProfilePayload) =>
      AuthenticatedApiClient.post("/api/profile", createProfilePayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PROFILE] });
    },
  });
}
