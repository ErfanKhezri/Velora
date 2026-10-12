import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="relative mb-5">
        <div className="absolute inset-0 scale-150 rounded-full bg-blush-200/50 blur-2xl dark:bg-champagne-300/10" />
        <div className="relative grid size-20 place-items-center rounded-full border border-line bg-surface shadow-soft">
          <Icon className="size-8 text-blush-500 dark:text-champagne-300" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {text && <p className="mt-1.5 max-w-xs text-sm leading-7 text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
