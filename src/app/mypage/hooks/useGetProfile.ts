import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/authenticatedApiClient";
import { QueryKey } from "@/constant/queryKeys";
import type { GetProfileResponse } from "../types";

export function useGetProfile(
  isQueryEnabled: boolean = true,
): UseQueryResult<GetProfileResponse, Error> {
  return useQuery({
    queryKey: [QueryKey.PROFILE],
    enabled: isQueryEnabled,
    queryFn: () => AuthenticatedApiClient.get("/api/profile"),
    staleTime: 60 * 1000,
  });
}
