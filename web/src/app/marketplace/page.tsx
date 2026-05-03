import { MarketplaceView } from "@/components/marketplace/marketplace-grid";
import { Panel } from "@/components/ui/panel";
import { getListings } from "@/lib/marketplace";
import { toListingDTO } from "@/lib/listing-serde";

export default async function MarketplacePage() {
  const listings = await getListings();
  const dtos = listings.map((l) => toListingDTO(l, false));

  return (
    <div className="space-y-5">
      <Panel className="space-y-3">
        <h1 className="text-2xl tracking-tight">Marketplace</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Browse, test-drive, and purchase autonomous agents.
        </p>
      </Panel>
      <MarketplaceView initialListings={dtos} />
    </div>
  );
}
