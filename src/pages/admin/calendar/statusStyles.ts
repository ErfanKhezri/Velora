import type { AppointmentStatus } from "../../../api";

export const blockStyles: Record<AppointmentStatus, string> = {
  pending:
    "border-dashed border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-50",
  confirmed:
    "border-blush-300 bg-blush-100 text-blush-900 dark:border-blush-300/40 dark:bg-blush-400/15 dark:text-blush-50",
  done: "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-300/30 dark:bg-emerald-300/10 dark:text-emerald-50",
  cancelled: "border-line bg-elevated text-muted line-through opacity-70",
};
