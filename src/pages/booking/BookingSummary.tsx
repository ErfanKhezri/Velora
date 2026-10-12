import { CalendarDays, Clock3, Scissors, UserRound } from "lucide-react";
import type { Service, Slot, Staff } from "../../api";
import { Card } from "../../components/ui/Card";
import { formatDay, formatDuration, formatPrice, formatTime } from "../../lib/date";
import { cn } from "../../lib/cn";

type Props = {
  service?: Service;
  person?: Staff;
  anyStaff: boolean;
  date: string | null;
  slot: Slot | null;
  className?: string;
};

export function BookingSummary({ service, person, anyStaff, date, slot, className }: Props) {
  const rows = [
    { icon: Scissors, label: "خدمت", value: service?.name },
    { icon: UserRound, label: "متخصص", value: anyStaff ? "اولین متخصص آزاد" : person?.name },
    { icon: CalendarDays, label: "تاریخ", value: date && formatDay(date) },
    { icon: Clock3, label: "ساعت", value: slot && formatTime(slot.startMin) },
  ];

  return (
    <Card className={cn("sticky top-24 overflow-hidden", className)}>
      <div className="relative bg-gradient-to-br from-orchid-100 via-mist to-iris-100 px-6 py-5 dark:from-night-700 dark:via-night-800 dark:to-night-900">
        <div className="absolute -top-10 -left-10 size-32 rounded-full bg-iris-200/60 blur-2xl dark:bg-iris-300/10" />
        <h2 className="relative font-semibold">خلاصه رزرو</h2>
        <p className="relative mt-1 text-xs text-muted">با هر انتخاب به‌روز می‌شود</p>
      </div>
      <dl className="space-y-4 px-6 py-5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-elevated text-orchid-600 dark:text-iris-300">
              <row.icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <dt className="text-xs text-muted">{row.label}</dt>
              <dd className={cn("truncate text-sm font-medium", !row.value && "text-muted/60")}>{row.value || "—"}</dd>
            </div>
          </div>
        ))}
      </dl>
      {service && (
        <div className="flex items-center justify-between border-t border-dashed border-line px-6 py-4">
          <span className="text-sm text-muted">{formatDuration(service.durationMin)}</span>
          <span className="font-semibold">{formatPrice(service.price)}</span>
        </div>
      )}
    </Card>
  );
}
