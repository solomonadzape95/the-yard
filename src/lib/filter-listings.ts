import type { ListingDTO } from "@/lib/listing-serde";

export type MarketplaceFilterState = {
  strategy: ListingDTO["strategy"] | "all";
  onlineOnly: boolean;
  query: string;
  sort: "name" | "saleAsc" | "saleDesc";
};

export function filterListingDTOs(
  listings: ListingDTO[],
  f: MarketplaceFilterState,
): ListingDTO[] {
  let out = [...listings];

  if (f.strategy !== "all") {
    out = out.filter((l) => l.strategy === f.strategy);
  }
  if (f.onlineOnly) {
    out = out.filter((l) => l.isOnline);
  }
  const q = f.query.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.ensName.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q),
    );
  }
  switch (f.sort) {
    case "saleAsc":
      out.sort((a, b) => (BigInt(a.salePrice) < BigInt(b.salePrice) ? -1 : 1));
      break;
    case "saleDesc":
      out.sort((a, b) => (BigInt(a.salePrice) > BigInt(b.salePrice) ? -1 : 1));
      break;
    default:
      out.sort((a, b) => a.name.localeCompare(b.name));
  }
  return out;
}
