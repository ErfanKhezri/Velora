import { useState } from "react";
import type { Slot } from "../../../api";
import { getMonthDates, JalaliCalendar } from "../../../components/JalaliCalendar";
import { TimeSlots } from "../../../components/TimeSlots";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useAvailability, useDayStatuses } from "../../../hooks/useAvailability";
import { today } from "../../../lib/date";

type Props = {
  serviceId: string;
  staffId: string | null;
  ignoreAppointmentId?: string;
  date: string | null;
  slot: Slot | null;
  onDateChange: (date: string) => void;
  onSlotChange: (slot: Slot) => void;
};

/** Jalali calendar + free time slots, used for admin booking and rescheduling. */
export function SlotPicker({ serviceId, staffId, ignoreAppointmentId, date, slot, onDateChange, onSlotChange }: Props) {
  const [month, setMonth] = useState(date ?? today());
  const statuses = useDayStatuses(serviceId, staffId, getMonthDates(month));
  const slots = useAvailability(serviceId, staffId, date, ignoreAppointmentId);

  return (
    <div className="space-y-5">
      <JalaliCalendar month={month} onMonthChange={setMonth} value={date} onChange={onDateChange} statuses={statuses.data} loading={statuses.isFetching} />
      {date &&
        (!slots.data ? (
          <Skeleton className="h-24" />
        ) : slots.data.length ? (
          <TimeSlots slots={slots.data} value={slot?.startMin ?? null} onChange={onSlotChange} />
        ) : (
          <p className="rounded-2xl bg-elevated p-4 text-center text-sm text-muted">زمان آزادی در این روز نیست</p>
        ))}
    </div>
  );
}
