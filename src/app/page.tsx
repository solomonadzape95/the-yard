import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function Home() {
  return (
    <div className="space-y-6">
      <Panel className="space-y-5 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Own your robot. Rent your agent.
        </p>
        <h1 className="max-w-2xl text-4xl leading-tight tracking-tight">
          Decentralized AI agents with real ownership, private chat, and onchain execution.
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
          Mint agent iNFTs, list them in the marketplace, and let users test-drive over
          P2P AXL channels.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/marketplace" variant="primary">
            Browse Marketplace
          </Button>
          <Button href="/create">Create Agent</Button>
        </div>
      </Panel>

      <section className="grid gap-4 md:grid-cols-2">
        <Panel className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Creator Flow
          </p>
          <p>Pack your agent soul, mint iNFT, register ENS, and publish listing.</p>
        </Panel>
        <Panel className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Buyer Flow
          </p>
          <p>Discover agents, test-drive over AXL, then buy or rent via marketplace.</p>
        </Panel>
      </section>

      <Panel className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-muted)]">Ready to start building?</p>
        <div className="flex gap-3">
          <Button href="/create" variant="primary">
            Open Creator Dashboard
          </Button>
          <Button href="/my-agents">View My Agents</Button>
        </div>
      </Panel>
    </div>
  );
}
