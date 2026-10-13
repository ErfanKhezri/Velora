import { motion, type HTMLMotionProps } from "motion/react";
import { LoaderCircle } from "lucide-react";
import { cn } from "../../lib/cn";

type Props = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const variants = {
  primary:
    "bg-brand text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.4),var(--shadow-glow)] hover:brightness-110",
  accent:
    "bg-gradient-to-l from-iris-500 via-orchid-500 to-orchid-400 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.45),var(--shadow-glow)] hover:brightness-110",
  secondary: "glass-thin border text-fg hover:bg-white/70 dark:hover:bg-white/10",
  ghost: "text-fg hover:bg-white/50 dark:hover:bg-white/10",
  danger: "bg-red-600/90 text-white hover:bg-red-600",
};

const sizes = {
  sm: "h-9 px-3.5 text-sm rounded-xl gap-1.5",
  md: "h-11 px-5 text-[15px] rounded-2xl gap-2",
  lg: "h-14 px-7 text-base rounded-2xl gap-2.5",
};

/** Button look for links and other non-button elements. */
export function buttonStyles(variant: keyof typeof variants = "primary", size: keyof typeof sizes = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-[background,opacity,filter,color] disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({ variant = "primary", size = "md", loading, disabled, className, children, ...props }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={buttonStyles(variant, size, className)}
      {...props}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children as React.ReactNode}
    </motion.button>
  );
}
