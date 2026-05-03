interface TextFieldProps {
  label: string;
  placeholder?: string;
  value?: string | number;
  type?: string;
}

export function TextField({
  label,
  placeholder,
  value,
  type = "text",
}: TextFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-xs uppercase tracking-wide text-[var(--color-muted)]">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        readOnly
        placeholder={placeholder}
        className="h-10 border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      />
    </label>
  );
}
