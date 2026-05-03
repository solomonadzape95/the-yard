import { type InputHTMLAttributes } from "react";

export function TextField({
  label,
  className = "",
  ...props
}: { label: string; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className={`flex flex-col gap-2 text-xs uppercase tracking-wide text-[var(--color-muted)] ${className}`}
    >
      <span>{label}</span>
      <input
        {...props}
        className="h-10 border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] read-only:opacity-80"
      />
    </label>
  );
}
