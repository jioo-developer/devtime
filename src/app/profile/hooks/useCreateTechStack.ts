import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@/constant/queryKeys";
import { requestWithAuth } from "@/config/apiConfig/authenticated/helpers";

type CreateTechStackRequest = {
  name: string;
};

type CreateTechStackResponse = {
  message: string;
  techStack: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
};

export function useCreateTechStack() {
  const queryClient = useQueryClient();

  return useMutation<CreateTechStackResponse, Error, CreateTechStackRequest>({
    mutationFn: (payload) =>
      requestWithAuth<CreateTechStackResponse>({
        method: "POST",
        endpoint: "/api/tech-stacks",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TECH_STACKS] });
    },
  });
}
