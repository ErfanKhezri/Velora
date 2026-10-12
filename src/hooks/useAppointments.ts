import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "../api";
import type { AppointmentStatus } from "../api";

export function useMyAppointments(customerId: string | undefined) {
  return useQuery({
    queryKey: ["appointments", "mine", customerId],
    queryFn: () => api.getMyAppointments(customerId!),
    enabled: !!customerId,
  });
}

export function useAppointments(from: string, to: string) {
  return useQuery({ queryKey: ["appointments", from, to], queryFn: () => api.getAppointments(from, to) });
}

export function useCreateAppointment() {
  return useMutation({ mutationFn: api.createAppointment });
}

export function useAdminCreateAppointment() {
  return useMutation({ mutationFn: api.adminCreateAppointment });
}

export function useCancelMyAppointment() {
  return useMutation({ mutationFn: api.cancelMyAppointment });
}

export function useUpdateAppointment() {
  return useMutation({
    mutationFn: (v: { id: string; status?: AppointmentStatus; note?: string }) =>
      api.updateAppointment(v.id, { status: v.status, note: v.note }),
  });
}

export function useRescheduleAppointment() {
  return useMutation({
    mutationFn: (v: { id: string; date: string; startMin: number }) =>
      api.rescheduleAppointment(v.id, v.date, v.startMin),
  });
}
