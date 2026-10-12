import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "../api";

export function useServices() {
  return useQuery({ queryKey: ["services"], queryFn: api.getServices });
}

export function useSaveService() {
  return useMutation({ mutationFn: api.saveService });
}

export function useDeleteService() {
  return useMutation({ mutationFn: api.deleteService });
}
