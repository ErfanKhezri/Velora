import type { Staff } from "../../api";
import { cn } from "../../lib/cn";

/** Initials avatar on a soft gradient (the demo uses no portrait photos). */
export function Avatar({ staff, className }: { staff: Pick<Staff, "name" | "avatar">; className?: string }) {
  const initials = staff.name
    .split(" ")
    .map((part) => part[0])
    .join("‌");
  return (
    <div
      aria-hidden
      className={cn("grid size-12 shrink-0 place-items-center rounded-full font-semibold text-white shadow-soft ring-2 ring-surface", className)}
      style={{ background: `linear-gradient(135deg, ${staff.avatar}, color-mix(in oklab, ${staff.avatar} 55%, #f5e6d3))` }}
    >
      {initials}
    </div>
  );
}
