import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig/apiConfig";
import type { LoginData } from "../types";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginData) => ApiClient.post("/api/auth/login", data),
  });
};
