import { useQuery } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/apiConfig/authenticated/AuthApiConfig";
import { QueryKey } from "@/constant/queryKeys";
import type { ApiResponseSuccess } from "@/types/api/helpers";

type TechStacksResponse = ApiResponseSuccess<"/api/tech-stacks", "get">;

export function useTechStacks() {
  return useQuery({
    queryKey: [QueryKey.TECH_STACKS],
    queryFn: () => AuthenticatedApiClient.get("/api/tech-stacks"),
    staleTime: Infinity,
    select: (data: TechStacksResponse) =>
      data.results.map((stack) => ({
        value: stack.name,
        label: stack.name,
      })),
  });
}
