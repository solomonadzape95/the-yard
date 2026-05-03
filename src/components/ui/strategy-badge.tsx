import { type StrategyMode } from "@/lib/mock-data";

const strategyColorMap: Record<StrategyMode, string> = {
  conservative: "text-emerald-300",
  aggressive: "text-rose-300",
  research: "text-sky-300",
  custom: "text-amber-200",
};

export function StrategyBadge({ strategy }: { strategy: StrategyMode }) {
  return (
    <span
      className={`inline-flex border border-[var(--color-border)] px-2 py-1 text-[10px] uppercase tracking-wide ${strategyColorMap[strategy]}`}
    >
      {strategy}
    </span>
  );
}
