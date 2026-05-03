import { notFound } from "next/navigation";

import { AgentDetailView } from "@/components/marketplace/agent-detail-view";
import { resolveAgentRecords } from "@/lib/ens";
import { getListingByName } from "@/lib/marketplace";
import { toListingDTO } from "@/lib/listing-serde";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ agentName: string }>;
}) {
  const { agentName } = await params;
  const listing = await getListingByName(agentName);

  if (!listing) {
    notFound();
  }

  const ensMeta = await resolveAgentRecords(listing.ensName);
  const ensResolved = Boolean(
    ensMeta &&
      (ensMeta.storageHash ||
        ensMeta.strategy ||
        ensMeta.axlPeerId ||
        ensMeta.lastAction),
  );

  const dto = toListingDTO(listing, ensResolved);

  return <AgentDetailView listing={dto} ensMeta={ensMeta} />;
}
