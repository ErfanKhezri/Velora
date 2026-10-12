import { motion } from "motion/react";
import { useId } from "react";
import { cn } from "../../lib/cn";

type Tab<T extends string> = { id: T; label: React.ReactNode };

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Tab<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  const layoutId = useId();
  return (
    <div role="tablist" className={cn("inline-flex gap-1 rounded-2xl border border-line bg-surface p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          type="button"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative flex-1 cursor-pointer rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
            value === tab.id ? "text-primary-fg" : "text-muted hover:text-fg",
          )}
        >
          {value === tab.id && (
            <motion.span layoutId={layoutId} className="absolute inset-0 rounded-xl bg-primary" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} />
          )}
          <span className="relative">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
