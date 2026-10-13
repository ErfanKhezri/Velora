import { motion } from "motion/react";
import type { AppointmentDetails } from "../../../api";
import { dayjs, formatClock, jalali, toDateKey, toFa, today, WEEKDAYS } from "../../../lib/date";
import { cn } from "../../../lib/cn";
import { blockStyles } from "./statusStyles";

type Props = {
  weekStart: string;
  appointments: AppointmentDetails[];
  onSelect: (id: string) => void;
  onOpenDay: (date: string) => void;
};

export function WeekView({ weekStart, appointments, onSelect, onOpenDay }: Props) {
  const days = Array.from({ length: 7 }, (_, i) => toDateKey(dayjs(weekStart).add(i, "day")));

  return (
    <div className="grid gap-3 md:grid-cols-7">
      {days.map((date, i) => {
        const items = appointments.filter((a) => toDateKey(a.startsAt) === date);
        return (
          <section key={date} className={cn("glass rounded-3xl p-2 md:min-h-80", i === 6 && "opacity-80")}>
            <button
              type="button"
              onClick={() => onOpenDay(date)}
              className="flex w-full cursor-pointer items-center justify-between rounded-2xl px-2 py-2 text-start hover:bg-elevated md:flex-col md:items-start"
            >
              <span className="text-xs text-muted">{WEEKDAYS[i]}</span>
              <span className={cn("text-lg font-bold", date === today() && "text-orchid-600 dark:text-iris-300")}>
                {toFa(jalali(date).format("D MMMM"))}
              </span>
            </button>
            <div className="mt-1 space-y-1.5">
              {items.length === 0 && <p className="px-2 py-3 text-xs text-muted/70">بدون نوبت</p>}
              {items.map((a) => (
                <motion.button
                  key={a.id}
                  type="button"
                  layout
                  whileHover={{ y: -1 }}
                  onClick={() => onSelect(a.id)}
                  className={cn("block w-full cursor-pointer rounded-xl border px-2.5 py-2 text-start text-xs", blockStyles[a.status])}
                >
                  <span className="flex items-center justify-between gap-1">
                    <span className="font-semibold tabular-nums">{formatClock(a.startsAt)}</span>
                    <span className="size-2 shrink-0 rounded-full" style={{ background: a.staff.avatar }} title={a.staff.name} />
                  </span>
                  <span className="mt-0.5 block truncate">{a.service.name}</span>
                  <span className="block truncate opacity-75">{a.customer.name}</span>
                </motion.button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
