import { motion } from "motion/react";
import { Moon, Sun, Sunrise } from "lucide-react";
import type { Slot } from "../api";
import { formatTime } from "../lib/date";
import { cn } from "../lib/cn";

const groups = [
  { label: "صبح", icon: Sunrise, test: (m: number) => m < 720 },
  { label: "بعدازظهر", icon: Sun, test: (m: number) => m >= 720 && m < 960 },
  { label: "عصر", icon: Moon, test: (m: number) => m >= 960 },
];

type Props = { slots: Slot[]; value: number | null; onChange: (slot: Slot) => void };

export function TimeSlots({ slots, value, onChange }: Props) {
  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const items = slots.filter((s) => group.test(s.startMin));
        if (!items.length) return null;
        return (
          <section key={group.label}>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted">
              <group.icon className="size-4" aria-hidden />
              {group.label}
            </h4>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {items.map((slot, i) => {
                const selected = value === slot.startMin;
                return (
                  <motion.button
                    key={slot.startMin}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onChange(slot)}
                    aria-pressed={selected}
                    className={cn(
                      "relative h-12 cursor-pointer rounded-2xl border text-[15px] font-medium tabular-nums transition-colors",
                      selected ? "border-transparent text-primary-fg" : "glass-thin hover:border-orchid-300 dark:hover:border-iris-300/50",
                    )}
                  >
                    {selected && (
                      <motion.span layoutId="slot-selected" className="absolute inset-0 rounded-2xl bg-brand shadow-soft" transition={{ type: "spring", duration: 0.35, bounce: 0.2 }} />
                    )}
                    <span className="relative">{formatTime(slot.startMin)}</span>
                  </motion.button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
