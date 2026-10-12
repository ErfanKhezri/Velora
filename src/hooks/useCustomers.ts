import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "../api";

export function useRequestOtp() {
  return useMutation({ mutationFn: api.requestOtp });
}

export function useVerifyOtp() {
  return useMutation({ mutationFn: (v: { phone: string; code: string }) => api.verifyOtp(v.phone, v.code) });
}

export function useCreateCustomer() {
  return useMutation({ mutationFn: (v: { phone: string; name: string }) => api.createCustomer(v.phone, v.name) });
}

export function useSearchCustomers(query: string) {
  return useQuery({ queryKey: ["customers", query], queryFn: () => api.searchCustomers(query), enabled: !!query.trim() });
}
