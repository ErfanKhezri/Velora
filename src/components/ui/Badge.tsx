import type { AppointmentStatus } from "../../api";
import { STATUS_LABEL } from "../../lib/constants";
import { cn } from "../../lib/cn";

export const statusColors: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200",
  confirmed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
  done: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200",
  cancelled: "bg-stone-200 text-stone-600 line-through decoration-1 dark:bg-white/10 dark:text-white/50",
};

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return <Badge className={statusColors[status]}>{STATUS_LABEL[status]}</Badge>;
}
