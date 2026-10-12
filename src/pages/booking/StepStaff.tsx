import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Avatar } from "../../components/ui/Avatar";
import { Skeleton } from "../../components/ui/Skeleton";
import { useStaff } from "../../hooks/useStaff";
import { cn } from "../../lib/cn";

type Props = { serviceId: string; value: string | null; onChange: (id: string) => void };

export function StepStaff({ serviceId, value, onChange }: Props) {
  const { data: staff } = useStaff(serviceId);

  if (!staff) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const options = [
    { id: "any", name: "فرقی نمی‌کند", title: "اولین متخصص آزاد برای شما رزرو می‌شود", avatar: "" },
    ...staff,
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option, i) => {
        const selected = value === option.id;
        return (
          <motion.button
            key={option.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            onClick={() => onChange(option.id)}
            aria-pressed={selected}
            className={cn(
              "relative flex cursor-pointer items-center gap-4 rounded-3xl border p-4 text-start transition-colors",
              selected ? "border-transparent bg-orchid-50 dark:bg-white/5" : "glass-thin hover:border-orchid-200 dark:hover:border-white/15",
            )}
          >
            {selected && <motion.span layoutId="staff-selected" className="absolute inset-0 rounded-3xl border-2 border-orchid-400 dark:border-iris-300" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} />}
            {option.id === "any" ? (
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-iris-200 to-orchid-200 text-night-800 shadow-soft">
                <Sparkles className="size-6" aria-hidden />
              </span>
            ) : (
              <Avatar staff={option} className="size-14 text-lg" />
            )}
            <span className="min-w-0">
              <span className="block font-semibold">{option.name}</span>
              <span className="mt-0.5 block text-sm leading-6 text-muted">{option.title}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
