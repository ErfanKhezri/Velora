import { motion } from "motion/react";
import { Check, Clock3 } from "lucide-react";
import { useState } from "react";
import type { Category, Service } from "../../api";
import { Skeleton } from "../../components/ui/Skeleton";
import { CATEGORIES, CATEGORY_ICON } from "../../lib/constants";
import { formatDuration, formatPrice } from "../../lib/date";
import { cn } from "../../lib/cn";

type Props = { services?: Service[]; value: string | null; onChange: (id: string) => void };

export function StepService({ services, value, onChange }: Props) {
  const [category, setCategory] = useState<Category | "all">("all");

  if (!services) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }

  const visible = services.filter((s) => s.active && (category === "all" || s.category === category));

  return (
    <div>
      <div className="-mx-5 mb-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="دسته‌بندی خدمات">
        {[{ id: "all" as const, label: "همه" }, ...CATEGORIES].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            aria-pressed={category === c.id}
            className={cn(
              "relative shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              category === c.id ? "border-transparent text-primary-fg" : "border-line text-muted hover:text-fg",
            )}
          >
            {category === c.id && <motion.span layoutId="category-pill" className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} />}
            <span className="relative">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {visible.map((service, i) => {
          const Icon = CATEGORY_ICON[service.category];
          const selected = value === service.id;
          return (
            <motion.button
              key={service.id}
              type="button"
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -2 }}
              onClick={() => onChange(service.id)}
              aria-pressed={selected}
              className={cn(
                "relative flex cursor-pointer gap-4 rounded-3xl border p-4 text-start transition-colors",
                selected ? "border-transparent bg-orchid-50 dark:bg-white/5" : "glass-thin hover:border-orchid-200 dark:hover:border-white/15",
              )}
            >
              {selected && (
                <motion.span layoutId="service-selected" className="absolute inset-0 rounded-3xl border-2 border-orchid-400 dark:border-iris-300" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} />
              )}
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orchid-100 to-iris-100 text-orchid-600 dark:from-white/10 dark:to-white/5 dark:text-iris-300">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="font-semibold">{service.name}</span>
                  {selected && (
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-orchid-500 text-white dark:bg-iris-300 dark:text-night-900">
                      <Check className="size-3" />
                    </span>
                  )}
                </span>
                <span className="mt-1 line-clamp-1 block text-xs leading-6 text-muted">{service.description}</span>
                <span className="mt-2 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1 text-muted">
                    <Clock3 className="size-3.5" aria-hidden />
                    {formatDuration(service.durationMin)}
                  </span>
                  <span className="font-semibold">{formatPrice(service.price)}</span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
