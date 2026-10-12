import { Link } from "react-router";
import { cn } from "../lib/cn";

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn("group inline-flex items-center gap-2.5", className)} aria-label="ولورا — صفحه اصلی">
      <span className="relative grid size-9 place-items-center rounded-full bg-gradient-to-br from-blush-300 via-blush-200 to-champagne-200 shadow-soft transition-transform group-hover:rotate-12 dark:from-champagne-300 dark:via-blush-300 dark:to-champagne-200">
        <svg viewBox="0 0 24 24" className="size-5 text-plum-800" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M5 5l7 14 7-14" />
          <path d="M9.5 5.5c1 2 4 2 5 0" />
        </svg>
      </span>
      <span dir="ltr" className="text-xl font-semibold tracking-[0.18em] text-fg">
        VELORA
      </span>
    </Link>
  );
}
