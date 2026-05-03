"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { AgentAvatar } from "@/components/ui/agent-avatar";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import type { ListingDTO } from "@/lib/listing-serde";
import {
  listingRentPerDayUsdcFromDto,
  listingSaleUsdcFromDto,
} from "@/lib/listing-serde";

type AgentsPayload = {
  owned: ListingDTO[];
  rented: (ListingDTO & { rentalExpiry: number })[];
};

export function MyAgentsView() {
  const { address, isConnected } = useAccount();

  const q = useQuery({
    queryKey: ["my-agents", address],
    enabled: Boolean(address),
    queryFn: async () => {
      const res = await fetch(`/api/my-agents/${address}`);
      if (!res.ok) throw new Error("fetch failed");
      return res.json() as Promise<AgentsPayload>;
    },
  });

  if (!isConnected || !address) {
    return (
      <Panel className="p-6 text-sm text-[var(--color-muted)]">
        Connect a wallet to load agents tied to your address.
      </Panel>
    );
  }

  if (q.isLoading) {
    return <Panel className="p-6 text-sm">Loading…</Panel>;
  }

  if (q.isError || !q.data) {
    return (
      <Panel className="p-6 text-sm text-rose-300">Could not load agent data.</Panel>
    );
  }

  const { owned, rented } = q.data;

  return (
    <div className="space-y-6">
      <Panel className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
          Buyer · Owned
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {owned.length === 0 && (
            <p className="text-sm text-[var(--color-muted)]">No owned agents.</p>
          )}
          {owned.map((agent) => (
            <AgentCard key={agent.tokenId} agent={agent} mode="owned" />
          ))}
        </div>
      </Panel>

      <Panel className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
          Buyer · Rented
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {rented.length === 0 && (
            <p className="text-sm text-[var(--color-muted)]">No active rentals.</p>
          )}
          {rented.map((agent) => (
            <AgentCard
              key={`rented-${agent.tokenId}`}
              agent={agent}
              mode="rented"
              expiry={agent.rentalExpiry}
            />
          ))}
        </div>
      </Panel>

      <Panel className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
          Creator dashboard
        </p>
        <p className="text-sm text-[var(--color-muted)]">
          Same inventory as owned tokens; on-chain listing actions happen from the Create
          flow / block explorer until delist UI ships.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
                <th className="px-3 py-2">Agent</th>
                <th className="px-3 py-2">ENS</th>
                <th className="px-3 py-2">Sale USDC</th>
                <th className="px-3 py-2">Rent / day</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {owned.map((agent) => (
                <tr key={`cr-${agent.tokenId}`} className="border border-[var(--color-border)]">
                  <td className="px-3 py-2">{agent.name}</td>
                  <td className="px-3 py-2 font-mono text-xs text-[var(--color-muted)]">
                    {agent.ensName}
                  </td>
                  <td className="px-3 py-2">{listingSaleUsdcFromDto(agent)}</td>
                  <td className="px-3 py-2">{listingRentPerDayUsdcFromDto(agent)}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Button href={`/marketplace/${agent.name}`} className="h-8 px-2 text-[10px]">
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function AgentCard({
  agent,
  mode,
  expiry,
}: {
  agent: ListingDTO;
  mode: "owned" | "rented";
  expiry?: number;
}) {
  return (
    <div className="space-y-3 border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
      <div className="flex items-center gap-3">
        <AgentAvatar name={agent.name} />
        <div>
          <p>{agent.ensName}</p>
          <p className="text-xs text-[var(--color-muted)]">
            {mode === "owned" ? "Owned" : "Rented"}
            {expiry
              ? ` · expires ${new Date(expiry * 1000).toLocaleString()}`
              : ""}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button href={`/marketplace/${agent.name}`} className="h-9 px-3 text-[10px]">
          Open chat
        </Button>
        <Button variant="secondary" className="h-9 px-3 text-[10px]" type="button">
          View memory
        </Button>
        {mode === "owned" && (
          <Button variant="secondary" className="h-9 px-3 text-[10px]" type="button">
            Relist
          </Button>
        )}
      </div>
    </div>
  );
}
