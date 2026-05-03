import type { StrategyMode } from "@/lib/mock-data";

export type Listing = {
  tokenId: bigint;
  name: string;
  ensName: string;
  description: string;
  storageHash: string;
  axlPeerId: string;
  strategy: StrategyMode;
  salePrice: bigint;
  rentalPricePerDay: bigint;
  isOnline: boolean;
  owner: `0x${string}`;
  currentRenter: `0x${string}` | null;
  rentalExpiry: number | null;
};

export type MarketplaceFilter = {
  strategy: StrategyMode | "all";
  onlineOnly: boolean;
  query: string;
  sort: "name" | "saleAsc" | "saleDesc";
};
