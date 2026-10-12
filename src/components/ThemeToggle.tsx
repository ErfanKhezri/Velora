import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { isDark, setTheme } from "../lib/theme";
import { cn } from "../lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(isDark);

  function toggle() {
    setTheme(!dark);
    setDark(!dark);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "حالت روشن" : "حالت تیره"}
      className={cn(
        "relative grid size-10 cursor-pointer place-items-center overflow-hidden rounded-full border border-line bg-surface text-fg transition-colors hover:bg-elevated",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ y: 16, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -16, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.25 }}
        >
          {dark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
