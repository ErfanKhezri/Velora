import { dayjs, minutesOfDay, today, weekdayOf } from "./date";
import type { DayStatus, Db, Slot } from "../api/types";

type Range = [number, number];

/** Busy minute ranges for one staff member on one day (time off + appointments). */
function busyRanges(db: Db, staffId: string, date: string, ignoreAppointmentId?: string) {
  const dayStart = dayjs(date).startOf("day");
  const dayEnd = dayStart.add(1, "day");
  const ranges: Range[] = [];

  function add(startsAt: string, endsAt: string) {
    const start = dayjs(startsAt);
    const end = dayjs(endsAt);
    if (!end.isAfter(dayStart) || !start.isBefore(dayEnd)) return;
    ranges.push([Math.max(0, start.diff(dayStart, "minute")), Math.min(1440, end.diff(dayStart, "minute"))]);
  }

  for (const t of db.timeOff) {
    if (t.staffId === null || t.staffId === staffId) add(t.startsAt, t.endsAt);
  }
  for (const a of db.appointments) {
    if (a.staffId === staffId && a.status !== "cancelled" && a.id !== ignoreAppointmentId) add(a.startsAt, a.endsAt);
  }
  return ranges;
}

function freeStarts(db: Db, staffId: string, date: string, durationMin: number, ignoreAppointmentId?: string) {
  const interval = db.settings.slotInterval;
  const hours = db.workingHours.filter((h) => h.staffId === staffId && h.weekday === weekdayOf(date));
  const busy = busyRanges(db, staffId, date, ignoreAppointmentId);
  const nowMin = date === today() ? minutesOfDay(dayjs()) : -1;
  const starts: number[] = [];

  for (const h of hours) {
    for (let t = h.startMin; t + durationMin <= h.endMin; t += interval) {
      if (t <= nowMin) continue;
      if (busy.some(([bs, be]) => t < be && t + durationMin > bs)) continue;
      starts.push(t);
    }
  }
  return starts;
}

/** Active staff who can perform the service, optionally narrowed to one person. */
export function candidateStaff(db: Db, serviceId: string, staffId: string | null) {
  return db.staff.filter(
    (s) => s.active && s.serviceIds.includes(serviceId) && (staffId === null || s.id === staffId),
  );
}

/**
 * Free start times for a service on a date. With `staffId = null` slots from all
 * staff offering the service are merged ("any staff").
 */
export function getSlots(
  db: Db,
  serviceId: string,
  staffId: string | null,
  date: string,
  ignoreAppointmentId?: string,
): Slot[] {
  const service = db.services.find((s) => s.id === serviceId);
  if (!service || date < today()) return [];

  const byStart = new Map<number, string[]>();
  for (const person of candidateStaff(db, serviceId, staffId)) {
    for (const start of freeStarts(db, person.id, date, service.durationMin, ignoreAppointmentId)) {
      byStart.set(start, [...(byStart.get(start) ?? []), person.id]);
    }
  }
  return [...byStart.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([startMin, staffIds]) => ({ startMin, staffIds }));
}

export function getDayStatus(db: Db, serviceId: string, staffId: string | null, date: string): DayStatus {
  if (date < today()) return "past";

  const weekday = weekdayOf(date);
  const people = candidateStaff(db, serviceId, staffId);
  const anyoneWorks = people.some((p) => db.workingHours.some((h) => h.staffId === p.id && h.weekday === weekday));
  const dayStart = dayjs(date).startOf("day");
  const dayEnd = dayStart.add(1, "day");
  const salonClosed = db.timeOff.some(
    (t) => t.staffId === null && !dayjs(t.startsAt).isAfter(dayStart) && !dayjs(t.endsAt).isBefore(dayEnd),
  );
  if (!anyoneWorks || salonClosed) return "closed";

  return getSlots(db, serviceId, staffId, date).length ? "open" : "full";
}
