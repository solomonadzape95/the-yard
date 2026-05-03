interface TabsProps {
  options: string[];
  active: string;
}

export function Tabs({ options, active }: TabsProps) {
  return (
    <div className="inline-flex border border-[var(--color-border)]">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`border-r border-[var(--color-border)] px-3 py-2 text-xs uppercase tracking-wide last:border-r-0 ${
            active === option
              ? "bg-[var(--color-accent)] text-white"
              : "bg-[var(--color-surface)] text-[var(--color-muted)]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
