import { MyAgentsView } from "@/components/marketplace/my-agents-view";
import { Panel } from "@/components/ui/panel";

export default function MyAgentsPage() {
  return (
    <div className="space-y-5">
      <Panel className="space-y-3">
        <h1 className="text-2xl tracking-tight">My Agents</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Load inventory from chain when env vars point at deployed contracts; otherwise
          responses follow mock ownership in the marketplace adapter.
        </p>
      </Panel>
      <MyAgentsView />
    </div>
  );
}
