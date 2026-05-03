export function AgentAvatar({ name }: { name: string }) {
  const initials = name
    .split("-")
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  return (
    <div className="flex h-16 w-16 items-center justify-center border border-[var(--color-border)] bg-[var(--color-bg)] text-sm tracking-widest text-[var(--color-text)]">
      {initials}
    </div>
  );
}
