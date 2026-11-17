import { forwardRef } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-xl border border-line-strong bg-card px-3.5 py-2.5 text-[14px] text-ink shadow-[inset_0_1px_2px_rgba(11,31,24,0.04)] transition-colors placeholder:text-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-coral aria-[invalid=true]:ring-coral/15";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-[12.5px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} role="alert" className="text-[12px] font-medium text-coral">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11.5px] leading-relaxed text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(controlBase, className)} {...props} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(controlBase, "min-h-28 resize-y", className)} {...props} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(controlBase, "appearance-none pr-9", className)} {...props}>
        {children}
      </select>
    );
  },
);

export function Checkbox({
  label,
  id,
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; id: string; error?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-line-strong text-brand accent-[var(--vv-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        <label htmlFor={id} className="text-[12.5px] leading-relaxed text-muted">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[12px] font-medium text-coral">
          {error}
        </p>
      ) : null}
    </div>
  );
}
