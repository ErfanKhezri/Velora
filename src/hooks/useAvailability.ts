import { useQuery } from "@tanstack/react-query";
import * as api from "../api";

export function useAvailability(
  serviceId: string | null,
  staffId: string | null,
  date: string | null,
  ignoreAppointmentId?: string,
) {
  return useQuery({
    queryKey: ["availability", serviceId, staffId, date, ignoreAppointmentId],
    queryFn: () => api.getAvailability(serviceId!, staffId, date!, ignoreAppointmentId),
    enabled: !!serviceId && !!date,
  });
}

export function useDayStatuses(serviceId: string | null, staffId: string | null, dates: string[]) {
  return useQuery({
    queryKey: ["day-statuses", serviceId, staffId, dates[0], dates.length],
    queryFn: () => api.getDayStatuses(serviceId!, staffId, dates),
    enabled: !!serviceId,
  });
}
