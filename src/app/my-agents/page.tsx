import { AgentAvatar } from "@/components/ui/agent-avatar";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Tabs } from "@/components/ui/tabs";
import { OWNED_AGENTS, RENTED_AGENTS } from "@/lib/mock-data";

export default function MyAgentsPage() {
  return (
    <div className="space-y-5">
      <Panel className="space-y-3">
        <h1 className="text-2xl tracking-tight">My Agents</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Creator dashboard and owner/renter access in one place.
        </p>
      </Panel>

      <Panel className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Buyer View</p>
        <Tabs options={["Owned", "Rented"]} active="Owned" />
        <div className="grid gap-3 md:grid-cols-2">
          {OWNED_AGENTS.map((agent) => (
            <div
              key={agent.tokenId}
              className="space-y-3 border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
            >
              <div className="flex items-center gap-3">
                <AgentAvatar name={agent.name} />
                <div>
                  <p>{agent.ensName}</p>
                  <p className="text-xs text-[var(--color-muted)]">Owned</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="h-9 px-3 text-[10px]">Open Chat</Button>
                <Button className="h-9 px-3 text-[10px]">View Memory</Button>
                <Button className="h-9 px-3 text-[10px]">Relist</Button>
              </div>
            </div>
          ))}
          {RENTED_AGENTS.map((agent) => (
            <div
              key={`rented-${agent.tokenId}`}
              className="space-y-3 border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
            >
              <div className="flex items-center gap-3">
                <AgentAvatar name={agent.name} />
                <div>
                  <p>{agent.ensName}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    Rented · expires in {agent.expiresIn}
                  </p>
                </div>
              </div>
              <Button className="h-9 px-3 text-[10px]">Open Chat</Button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
          Creator Dashboard
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
                <th className="px-3 py-2">Agent</th>
                <th className="px-3 py-2">ENS</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Rental Expiry</th>
                <th className="px-3 py-2">Earnings</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {OWNED_AGENTS.map((agent) => (
                <tr key={`table-${agent.tokenId}`} className="border border-[var(--color-border)]">
                  <td className="px-3 py-2">{agent.name}</td>
                  <td className="px-3 py-2 text-[var(--color-muted)]">{agent.ensName}</td>
                  <td className="px-3 py-2">{agent.online ? "Listed" : "Unlisted"}</td>
                  <td className="px-3 py-2 text-[var(--color-muted)]">-</td>
                  <td className="px-3 py-2">{agent.salePriceUsdc} USDC</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Button className="h-8 px-2 text-[10px]">Update Price</Button>
                      <Button className="h-8 px-2 text-[10px]">Delist</Button>
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
