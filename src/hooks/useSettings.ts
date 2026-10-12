import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "../api";

export function useSettings() {
  return useQuery({ queryKey: ["settings"], queryFn: api.getSettings });
}

export function useUpdateSettings() {
  return useMutation({ mutationFn: api.updateSettings });
}

export function useAdminLogin() {
  return useMutation({ mutationFn: (v: { username: string; password: string }) => api.adminLogin(v.username, v.password) });
}

export function useResetDemo() {
  return useMutation({ mutationFn: api.resetDemo });
}
