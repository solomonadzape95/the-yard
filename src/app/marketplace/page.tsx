import { AgentAvatar } from "@/components/ui/agent-avatar";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { StrategyBadge } from "@/components/ui/strategy-badge";
import { MOCK_LISTINGS } from "@/lib/mock-data";

const filters = ["All", "Conservative", "Aggressive", "Research", "Online Only"];

export default function MarketplacePage() {
  return (
    <div className="space-y-5">
      <Panel className="space-y-3">
        <h1 className="text-2xl tracking-tight">Marketplace</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Browse, test-drive, and purchase autonomous agents.
        </p>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`border px-3 py-2 text-xs uppercase tracking-wide ${
                index === 0
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-muted)]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </Panel>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_LISTINGS.map((listing) => (
          <Panel key={listing.tokenId} className="space-y-4">
            <div className="flex items-center justify-between">
              <AgentAvatar name={listing.name} />
              <span
                className={`text-xs ${
                  listing.online ? "text-emerald-300" : "text-[var(--color-muted)]"
                }`}
              >
                {listing.online ? "Online" : "Offline"}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-lg">{listing.ensName}</p>
              <p className="line-clamp-2 text-sm text-[var(--color-muted)]">
                {listing.description}
              </p>
              <StrategyBadge strategy={listing.strategy} />
            </div>
            <div className="flex justify-between text-xs text-[var(--color-muted)]">
              <span>Sale: {listing.salePriceUsdc} USDC</span>
              <span>Rent: {listing.rentalPricePerDayUsdc} USDC/day</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                href={`/marketplace/${listing.name}`}
                variant="secondary"
                className="h-9 px-2 text-[10px]"
              >
                Test Drive
              </Button>
              <Button
                href={`/marketplace/${listing.name}`}
                variant="primary"
                className="h-9 px-2 text-[10px]"
              >
                Buy
              </Button>
              <Button
                href={`/marketplace/${listing.name}`}
                variant="secondary"
                className="h-9 px-2 text-[10px]"
              >
                Rent
              </Button>
            </div>
          </Panel>
        ))}
      </section>
    </div>
  );
}
