import { motion } from "motion/react";
import { Check } from "lucide-react";
import { toFa } from "../../lib/date";
import { cn } from "../../lib/cn";

export const STEPS = ["خدمت", "متخصص", "تاریخ", "ساعت", "ورود", "تأیید"];

export function StepProgress({ step }: { step: number }) {
  return (
    <div>
      {/* Mobile: a slim bar */}
      <div className="h-1.5 overflow-hidden rounded-full bg-line md:hidden" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-l from-blush-500 to-champagne-400"
          animate={{ width: `${(step / STEPS.length) * 100}%` }}
          transition={{ type: "spring", duration: 0.6, bounce: 0.1 }}
        />
      </div>

      {/* Desktop: labelled steps */}
      <ol className="hidden items-center md:flex">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <li key={label} className="flex flex-1 items-center last:flex-none" aria-current={active ? "step" : undefined}>
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "relative grid size-9 place-items-center rounded-full border text-sm font-semibold transition-colors duration-300",
                    done && "border-transparent bg-blush-500 text-white dark:bg-champagne-400 dark:text-plum-900",
                    active && "border-transparent bg-primary text-primary-fg shadow-soft",
                    !done && !active && "border-line bg-surface text-muted",
                  )}
                >
                  {active && <motion.span layoutId="step-ring" className="absolute -inset-1 rounded-full border-2 border-blush-300 dark:border-champagne-300/60" />}
                  {done ? <Check className="size-4" /> : toFa(n)}
                </span>
                <span className={cn("text-sm font-medium", active ? "text-fg" : "text-muted")}>{label}</span>
              </div>
              {n < STEPS.length && (
                <div className="mx-3 h-px flex-1 overflow-hidden bg-line">
                  <motion.div className="h-full bg-blush-400 dark:bg-champagne-300" initial={false} animate={{ width: done ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
