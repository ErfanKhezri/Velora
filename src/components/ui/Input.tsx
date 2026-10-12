import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

const field =
  "w-full rounded-2xl border border-line bg-surface px-4 text-fg placeholder:text-muted/70 transition-colors focus:border-blush-400 focus:outline-none focus:ring-4 focus:ring-blush-200/50 dark:focus:border-champagne-300 dark:focus:ring-champagne-300/15 aria-invalid:border-red-400";

type FieldProps = { label?: string; error?: string; hint?: ReactNode; children: (id: string) => ReactNode; className?: string };

export function Field({ label, error, hint, children, className }: FieldProps) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-fg/90">
          {label}
        </label>
      )}
      {children(id)}
      {error ? (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; hint?: ReactNode };

export function Input({ label, error, hint, className, ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      {(id) => <input id={id} ref={ref} aria-invalid={!!error} className={cn(field, "h-12")} {...props} />}
    </Field>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string };

export function Textarea({ label, error, className, ref, ...props }: TextareaProps & { ref?: React.Ref<HTMLTextAreaElement> }) {
  return (
    <Field label={label} error={error} className={className}>
      {(id) => <textarea id={id} ref={ref} aria-invalid={!!error} rows={3} className={cn(field, "resize-none py-3")} {...props} />}
    </Field>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string };

export function Select({ label, error, className, children, ref, ...props }: SelectProps & { ref?: React.Ref<HTMLSelectElement> }) {
  return (
    <Field label={label} error={error} className={className}>
      {(id) => (
        <select id={id} ref={ref} aria-invalid={!!error} className={cn(field, "h-12 appearance-none")} {...props}>
          {children}
        </select>
      )}
    </Field>
  );
}
