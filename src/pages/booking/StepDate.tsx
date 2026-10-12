import { useState } from "react";
import { getMonthDates, JalaliCalendar } from "../../components/JalaliCalendar";
import { useDayStatuses } from "../../hooks/useAvailability";
import { today } from "../../lib/date";

type Props = { serviceId: string; staffId: string | null; value: string | null; onChange: (date: string) => void };

export function StepDate({ serviceId, staffId, value, onChange }: Props) {
  const [month, setMonth] = useState(value ?? today());
  const statuses = useDayStatuses(serviceId, staffId, getMonthDates(month));

  return (
    <div className="mx-auto max-w-md">
      <JalaliCalendar
        month={month}
        onMonthChange={setMonth}
        value={value}
        onChange={onChange}
        statuses={statuses.data}
        loading={statuses.isFetching}
      />
      <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-primary" /> انتخاب‌شده
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-blush-500 dark:bg-champagne-300" /> امروز
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-line" /> تعطیل یا تکمیل
        </span>
      </div>
    </div>
  );
}
