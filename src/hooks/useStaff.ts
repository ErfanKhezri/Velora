import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "../api";
import type { WorkingHour } from "../api";

export function useStaff(serviceId?: string) {
  return useQuery({ queryKey: ["staff", serviceId], queryFn: () => api.getStaff(serviceId) });
}

export function useSaveStaff() {
  return useMutation({ mutationFn: api.saveStaff });
}

export function useWorkingHours() {
  return useQuery({ queryKey: ["working-hours"], queryFn: api.getWorkingHours });
}

export function useSaveWorkingHours() {
  return useMutation({
    mutationFn: (v: { staffId: string; hours: Omit<WorkingHour, "staffId">[] }) =>
      api.saveWorkingHours(v.staffId, v.hours),
  });
}

export function useTimeOff() {
  return useQuery({ queryKey: ["time-off"], queryFn: api.getTimeOff });
}

export function useAddTimeOff() {
  return useMutation({ mutationFn: api.addTimeOff });
}

export function useDeleteTimeOff() {
  return useMutation({ mutationFn: api.deleteTimeOff });
}
