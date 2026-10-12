import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DayStatus } from "../api";
import {
  daysInJalaliMonth,
  formatDay,
  formatMonth,
  jalali,
  startOfJalaliMonth,
  toDateKey,
  toFa,
  today,
  weekdayOf,
  WEEKDAYS_SHORT,
} from "../lib/date";
import { cn } from "../lib/cn";

/** All gregorian date keys of the Jalali month that contains `date`. */
export function getMonthDates(date: string) {
  const first = startOfJalaliMonth(date);
  return Array.from({ length: daysInJalaliMonth(date) }, (_, i) => toDateKey(first.add(i, "day")));
}

type Props = {
  month: string; // any date inside the visible month
  onMonthChange: (month: string) => void;
  value: string | null;
  onChange: (date: string) => void;
  statuses?: Record<string, DayStatus>;
  loading?: boolean;
};

const statusLabel: Record<DayStatus, string> = { open: "", full: "تکمیل", closed: "تعطیل", past: "" };

export function JalaliCalendar({ month, onMonthChange, value, onChange, statuses, loading }: Props) {
  const dates = getMonthDates(month);
  const first = startOfJalaliMonth(month);
  const blanks = weekdayOf(first);
  const canGoBack = first.isAfter(today());
  const now = today();

  return (
    <div className="select-none">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(toDateKey(first.subtract(1, "day")))}
          disabled={!canGoBack}
          aria-label="ماه قبل"
          className="grid size-10 cursor-pointer place-items-center rounded-full border border-line transition-colors hover:bg-elevated disabled:cursor-default disabled:opacity-30"
        >
          <ChevronRight className="size-5" />
        </button>
        <motion.h3 key={month.slice(0, 7)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-semibold" aria-live="polite">
          {formatMonth(first)}
        </motion.h3>
        <button
          type="button"
          onClick={() => onMonthChange(toDateKey(first.add(daysInJalaliMonth(first), "day")))}
          aria-label="ماه بعد"
          className="grid size-10 cursor-pointer place-items-center rounded-full border border-line transition-colors hover:bg-elevated"
        >
          <ChevronLeft className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted" aria-hidden>
        {WEEKDAYS_SHORT.map((d, i) => (
          <div key={d} className={cn("py-2", i === 6 && "text-blush-500 dark:text-blush-300")}>
            {d}
          </div>
        ))}
      </div>

      <div className={cn("grid grid-cols-7 gap-1 transition-opacity", loading && "opacity-50")}>
        {Array.from({ length: blanks }, (_, i) => (
          <div key={`b${i}`} />
        ))}
        {dates.map((date) => {
          const status = statuses?.[date] ?? (date < now ? "past" : "open");
          const disabled = loading || status !== "open";
          const selected = value === date;
          return (
            <button
              key={date}
              type="button"
              disabled={disabled}
              onClick={() => onChange(date)}
              aria-pressed={selected}
              aria-label={`${formatDay(date)}${statusLabel[status] ? ` — ${statusLabel[status]}` : ""}`}
              className={cn(
                "relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl text-[15px] transition-colors",
                !disabled && !selected && "hover:bg-blush-100 dark:hover:bg-white/5",
                disabled && "cursor-default text-muted/45",
                selected && "text-primary-fg",
              )}
            >
              {selected && (
                <motion.span layoutId="calendar-selected" className="absolute inset-0 rounded-2xl bg-primary shadow-soft" transition={{ type: "spring", duration: 0.4, bounce: 0.2 }} />
              )}
              <span className={cn("relative", date === now && !selected && "font-bold text-blush-600 dark:text-champagne-300")}>
                {toFa(jalali(date).date())}
              </span>
              {status === "full" && <span className="relative text-[9px] leading-none text-blush-500/80">تکمیل</span>}
              {date === now && !selected && <span className="absolute bottom-1.5 size-1 rounded-full bg-blush-500 dark:bg-champagne-300" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
