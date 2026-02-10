import {
  useQuery,
  useSuspenseQuery,
  UseQueryResult,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";
import { QueryKey } from "@/constant/queryKeys";
import type { GetProfileResponse } from "../types";

const profileQueryOptions = {
  queryKey: [QueryKey.PROFILE],
  queryFn: () => AuthenticatedApiClient.get("/api/profile"),
  staleTime: 60 * 1000,
} as const;

export function useGetProfile(
  isQueryEnabled: boolean = true,
): UseQueryResult<GetProfileResponse, Error> {
  return useQuery({
    ...profileQueryOptions,
    enabled: isQueryEnabled,
  });
}

export function useGetProfileSuspense(): UseSuspenseQueryResult<
  GetProfileResponse,
  Error
> {
  return useSuspenseQuery(profileQueryOptions);
}
