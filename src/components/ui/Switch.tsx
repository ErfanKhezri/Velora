import { motion } from "motion/react";
import { cn } from "../../lib/cn";

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors",
        checked ? "justify-end bg-blush-500 dark:bg-champagne-400" : "justify-start bg-line",
      )}
    >
      <motion.span layout transition={{ type: "spring", duration: 0.3, bounce: 0.2 }} className="size-5 rounded-full bg-white shadow" />
    </button>
  );
}
