import { cn } from "../../lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-2xl bg-[linear-gradient(90deg,var(--elevated)_0%,var(--line)_50%,var(--elevated)_100%)] bg-[length:200%_100%]",
        className,
      )}
    />
  );
}
