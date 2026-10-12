import { motion } from "motion/react";
import type { AppointmentDetails, Staff, WorkingHour } from "../../../api";
import { Avatar } from "../../../components/ui/Avatar";
import { dayjs, formatClock, formatTime, minutesOfDay, today, weekdayOf } from "../../../lib/date";
import { cn } from "../../../lib/cn";
import { blockStyles } from "./statusStyles";

const START = 9 * 60;
const END = 21 * 60;
const PX = 1.3; // pixels per minute
const hours = Array.from({ length: (END - START) / 60 + 1 }, (_, i) => START + i * 60);

type Props = {
  date: string;
  staff: Staff[];
  workingHours: WorkingHour[];
  appointments: AppointmentDetails[];
  mobileStaffId: string;
  onSelect: (id: string) => void;
};

export function DayView({ date, staff, workingHours, appointments, mobileStaffId, onSelect }: Props) {
  const weekday = weekdayOf(date);
  const nowMin = date === today() ? minutesOfDay(dayjs()) : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
      <div className="flex border-b border-line">
        <div className="w-14 shrink-0" />
        {staff.map((person) => (
          <div key={person.id} className={cn("flex flex-1 items-center gap-2.5 border-s border-line px-3 py-3", person.id !== mobileStaffId && "hidden md:flex")}>
            <Avatar staff={person} className="size-9 text-xs" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{person.name}</p>
              <p className="truncate text-xs text-muted">{person.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex max-h-[70dvh] overflow-y-auto">
        <div className="relative w-14 shrink-0" style={{ height: (END - START) * PX }}>
          {hours.map((h) => (
            <span key={h} className="absolute end-2 -translate-y-1/2 text-[11px] text-muted tabular-nums" style={{ top: (h - START) * PX }}>
              {h > START && formatTime(h)}
            </span>
          ))}
        </div>

        {staff.map((person) => {
          const shifts = workingHours.filter((h) => h.staffId === person.id && h.weekday === weekday);
          const items = appointments.filter((a) => a.staffId === person.id);
          return (
            <div
              key={person.id}
              className={cn(
                "relative flex-1 border-s border-line bg-[repeating-linear-gradient(135deg,transparent_0_6px,var(--line)_6px_7px)]",
                person.id !== mobileStaffId && "hidden md:block",
              )}
              style={{ height: (END - START) * PX }}
            >
              {shifts.map((s) => (
                <div key={s.startMin} className="absolute inset-x-0 bg-surface" style={{ top: (s.startMin - START) * PX, height: (s.endMin - s.startMin) * PX }} />
              ))}
              {hours.map((h) => (
                <div key={h} className="absolute inset-x-0 border-t border-line/70" style={{ top: (h - START) * PX }} />
              ))}

              {items.map((a, i) => {
                const top = (minutesOfDay(a.startsAt) - START) * PX;
                const height = dayjs(a.endsAt).diff(a.startsAt, "minute") * PX;
                return (
                  <motion.button
                    key={a.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelect(a.id)}
                    className={cn(
                      "absolute inset-x-1.5 cursor-pointer overflow-hidden rounded-xl border px-2.5 py-1.5 text-start text-xs shadow-sm transition-shadow hover:z-10 hover:shadow-soft",
                      blockStyles[a.status],
                    )}
                    style={{ top: top + 1, height: height - 2 }}
                  >
                    <p className="truncate font-semibold">{a.service.name}</p>
                    <p className="truncate opacity-80">
                      {formatClock(a.startsAt)} · {a.customer.name}
                    </p>
                  </motion.button>
                );
              })}

              {nowMin !== null && nowMin > START && nowMin < END && (
                <div className="pointer-events-none absolute inset-x-0 z-20 border-t-2 border-blush-500 dark:border-champagne-300" style={{ top: (nowMin - START) * PX }}>
                  <span className="absolute -top-[5px] -start-1 size-2 rounded-full bg-blush-500 dark:bg-champagne-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
