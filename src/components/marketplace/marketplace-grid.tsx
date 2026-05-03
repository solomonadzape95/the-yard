"use client";

import { useMemo, useState } from "react";

import { AgentAvatar } from "@/components/ui/agent-avatar";
import { Button } from "@/components/ui/button";
import { usePeerOnline } from "@/hooks/use-peer-online";
import {
  type MarketplaceFilterState,
  filterListingDTOs,
} from "@/lib/filter-listings";
import type { ListingDTO } from "@/lib/listing-serde";
import {
  listingRentPerDayUsdcFromDto,
  listingSaleUsdcFromDto,
} from "@/lib/listing-serde";

const STRATEGIES: (MarketplaceFilterState["strategy"] | "all")[] = [
  "all",
  "conservative",
  "aggressive",
  "research",
];

const SORTS: { id: MarketplaceFilterState["sort"]; label: string }[] = [
  { id: "name", label: "Name" },
  { id: "saleAsc", label: "Sale ↑" },
  { id: "saleDesc", label: "Sale ↓" },
];

export function MarketplaceFilterBar({
  value,
  onChange,
}: {
  value: MarketplaceFilterState;
  onChange: (v: MarketplaceFilterState) => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
      <label className="flex min-w-[200px] flex-1 flex-col gap-2 text-xs uppercase tracking-wide text-[var(--color-muted)]">
        Search
        <input
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="ENS, name, description"
          className="h-10 border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {STRATEGIES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange({ ...value, strategy: s })}
            className={`border px-3 py-2 text-xs uppercase tracking-wide ${
              value.strategy === s
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                : "border-[var(--color-border)] text-[var(--color-muted)]"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange({ ...value, onlineOnly: !value.onlineOnly })}
          className={`border px-3 py-2 text-xs uppercase tracking-wide ${
            value.onlineOnly
              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
              : "border-[var(--color-border)] text-[var(--color-muted)]"
          }`}
        >
          Online
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {SORTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange({ ...value, sort: s.id })}
            className={`border px-3 py-2 text-xs uppercase tracking-wide ${
              value.sort === s.id
                ? "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                : "border-[var(--color-border)] text-[var(--color-muted)]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MarketplaceCard({ listing }: { listing: ListingDTO }) {
  const liveOnline = usePeerOnline(listing.axlPeerId, listing.isOnline);

  return (
    <article className="space-y-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between">
        <AgentAvatar name={listing.name} />
        <span
          className={`text-xs ${
            liveOnline ? "text-emerald-300" : "text-[var(--color-muted)]"
          }`}
        >
          {liveOnline ? "Online" : "Offline"}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-lg">{listing.ensName}</p>
        <p className="line-clamp-2 text-sm text-[var(--color-muted)]">
          {listing.description}
        </p>
        <span className="inline-flex border border-[var(--color-border)] px-2 py-1 text-[10px] uppercase tracking-wide">
          {listing.strategy}
        </span>
      </div>
      <div className="flex justify-between text-xs text-[var(--color-muted)]">
        <span>Sale: {listingSaleUsdcFromDto(listing)} USDC</span>
        <span>Rent: {listingRentPerDayUsdcFromDto(listing)} / day</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button
          href={`/marketplace/${listing.name}`}
          variant="secondary"
          className="h-9 px-2 text-[10px]"
        >
          Open
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
    </article>
  );
}

export function MarketplaceView({
  initialListings,
}: {
  initialListings: ListingDTO[];
}) {
  const [filter, setFilter] = useState<MarketplaceFilterState>({
    strategy: "all",
    onlineOnly: false,
    query: "",
    sort: "name",
  });

  const visible = useMemo(
    () => filterListingDTOs(initialListings, filter),
    [initialListings, filter],
  );

  return (
    <div className="space-y-5">
      <MarketplaceFilterBar value={filter} onChange={setFilter} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((listing) => (
          <MarketplaceCard key={listing.tokenId} listing={listing} />
        ))}
      </section>
    </div>
  );
}
