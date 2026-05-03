import { notFound } from "next/navigation";

import { AgentAvatar } from "@/components/ui/agent-avatar";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { StrategyBadge } from "@/components/ui/strategy-badge";
import { TextField } from "@/components/ui/text-field";
import { MOCK_LISTINGS } from "@/lib/mock-data";

export default function AgentDetailPage({
  params,
}: {
  params: { agentName: string };
}) {
  const listing = MOCK_LISTINGS.find((item) => item.name === params.agentName);

  if (!listing) {
    notFound();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel className="space-y-4">
        <div className="flex items-center gap-4">
          <AgentAvatar name={listing.name} />
          <div className="space-y-1">
            <h1 className="text-2xl">{listing.ensName}</h1>
            <StrategyBadge strategy={listing.strategy} />
          </div>
        </div>
        <p className="text-sm text-[var(--color-muted)]">{listing.description}</p>
        <div className="grid gap-2 text-xs text-[var(--color-muted)]">
          <p>Storage Hash: {listing.storageHash}</p>
          <p>Token ID: #{listing.tokenId}</p>
          <p>Owner: {listing.owner}</p>
          <p>Last Action: {listing.lastAction}</p>
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Test Drive
          </p>
          <p className="text-sm">
            This conversation is P2P via Gensyn AXL - not routed through any server.
          </p>
          <Button variant="primary">Open Chat Drawer</Button>
          <div className="space-y-2 border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-sm">
            <p className="text-[var(--color-muted)]">User: Can you scan current signals?</p>
            <p>Agent: Research task queued. Signal summary arrives in 5s.</p>
            <div className="h-9 border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-muted)]">
              Message input (UI shell)
            </div>
          </div>
        </Panel>

        <Panel className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Buy</p>
          <TextField label="Amount (USDC)" value={listing.salePriceUsdc} />
          <p className="text-xs text-[var(--color-muted)]">
            You pay {listing.salePriceUsdc} USDC {"->"} Seller receives TOKEN (quote placeholder).
          </p>
          <Button variant="primary">Buy Now</Button>
        </Panel>

        <Panel className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Rent</p>
          <TextField label="Days" value={3} type="number" />
          <p className="text-xs text-[var(--color-muted)]">
            Total: {listing.rentalPricePerDayUsdc * 3} USDC (placeholder).
          </p>
          <Button>Rent Agent</Button>
        </Panel>
      </div>
    </div>
  );
}
