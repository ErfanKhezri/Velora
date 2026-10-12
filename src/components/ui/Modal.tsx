import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: boolean; // side sheet instead of a centered dialog
  className?: string;
};

export function Modal({ open, onClose, title, children, footer, side, className }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cn("fixed inset-0 z-50 flex", side ? "justify-end" : "items-end justify-center sm:items-center sm:p-6")}>
          <motion.div
            className="absolute inset-0 bg-night-950/30 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={side ? { x: "-100%" } : { y: 40, opacity: 0, scale: 0.98 }}
            animate={side ? { x: 0 } : { y: 0, opacity: 1, scale: 1 }}
            exit={side ? { x: "-100%" } : { y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
            className={cn(
              "glass relative flex max-h-[92dvh] w-full flex-col outline-none [--glass-tint:rgb(255_255_255/0.78)] dark:[--glass-tint:rgb(23_17_44/0.8)]",
              side
                ? "h-dvh max-h-dvh max-w-md border-e border-line sm:rounded-e-4xl"
                : "rounded-t-4xl sm:max-w-lg sm:rounded-4xl",
              className,
            )}
          >
            <header className="flex items-center justify-between gap-4 border-b border-line px-6 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
              <h2 className="py-1 text-lg font-semibold">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن"
                className="grid size-9 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-fg"
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <footer className="flex flex-wrap gap-2 border-t border-line px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function Sheet(props: Omit<Props, "side">) {
  return <Modal {...props} side />;
}
