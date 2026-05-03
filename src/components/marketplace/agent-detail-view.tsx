"use client";

import { useState } from "react";

import { AgentAvatar } from "@/components/ui/agent-avatar";
import { Button } from "@/components/ui/button";
import { StrategyBadge } from "@/components/ui/strategy-badge";
import { BuyPanel } from "@/components/marketplace/buy-panel";
import { ChatDrawer } from "@/components/marketplace/chat-drawer";
import { RentPanel } from "@/components/marketplace/rent-panel";
import type { ResolvedENS } from "@/lib/ens";
import type { ListingDTO } from "@/lib/listing-serde";

export function AgentDetailView({
  listing,
  ensMeta,
}: {
  listing: ListingDTO;
  ensMeta: ResolvedENS | null;
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSessionKey, setChatSessionKey] = useState(0);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-4">
            <AgentAvatar name={listing.name} />
            <div className="space-y-1">
              <h1 className="text-2xl">{listing.ensName}</h1>
              <StrategyBadge strategy={listing.strategy} />
            </div>
          </div>
          <p className="text-sm text-[var(--color-muted)]">{listing.description}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span
              className={`border px-2 py-1 uppercase tracking-wide ${
                listing.ensResolved || ensMeta
                  ? "border-emerald-400 text-emerald-300"
                  : "border-[var(--color-border)] text-[var(--color-muted)]"
              }`}
            >
              {listing.ensResolved || ensMeta ? "ENS data resolved" : "ENS fallback"}
            </span>
          </div>
          <div className="grid gap-2 font-mono text-xs text-[var(--color-muted)]">
            <p>storage-hash: {listing.storageHash}</p>
            <p>axl-peer-id: {listing.axlPeerId}</p>
            <p>token: #{listing.tokenId}</p>
            <p>owner: {listing.owner}</p>
            {ensMeta?.lastAction && <p>last-action: {ensMeta.lastAction}</p>}
          </div>
        </section>

        <div className="space-y-4">
          <div className="space-y-3 border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
              Test drive
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              P2P-style chat through the AXL-mode relay (see banner in drawer).
            </p>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                setChatSessionKey((k) => k + 1);
                setChatOpen(true);
              }}
            >
              Open chat
            </Button>
          </div>
          <BuyPanel listing={listing} />
          <RentPanel listing={listing} />
        </div>
      </div>
      <ChatDrawer
        key={chatSessionKey}
        listing={listing}
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}
