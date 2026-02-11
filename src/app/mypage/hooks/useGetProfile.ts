import {
  useQuery,
  useSuspenseQuery,
  UseQueryResult,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";
import { QueryKey } from "@/constant/queryKeys";
import type { GetProfileResponse } from "../types";

const profileQueryConfig = {
  queryKey: [QueryKey.PROFILE],
  queryFn: () => AuthenticatedApiClient.get("/api/profile"),
  staleTime: 60 * 1000,
} as const;

type UseGetProfileOptions = Partial<
  Parameters<typeof useQuery<GetProfileResponse, Error>>[0]
>;

export function useGetProfile(
  options?: UseGetProfileOptions,
): UseQueryResult<GetProfileResponse, Error> {
  return useQuery({
    ...profileQueryConfig,
    ...options,
  });
}

export function useGetProfileSuspense(): UseSuspenseQueryResult<
  GetProfileResponse,
  Error
> {
  return useSuspenseQuery(profileQueryConfig);
}
