import type { Listing } from "@/lib/agent-types";
import { MOCK_LISTINGS, type StrategyMode } from "@/lib/mock-data";
import { resolveAgentRecords } from "@/lib/ens";
import { fetchRegistryListings } from "@/lib/contracts/registry";

export type { Listing, MarketplaceFilter } from "@/lib/agent-types";

const USDC_DECIMALS = 6n;
const USDC_SCALE = 10n ** USDC_DECIMALS;

function mockToListing(m: (typeof MOCK_LISTINGS)[0]): Listing {
  const owner =
    m.owner.startsWith("0x") && m.owner.length === 42
      ? (m.owner as `0x${string}`)
      : ("0x0000000000000000000000000000000000000001" as `0x${string}`);

  return {
    tokenId: BigInt(m.tokenId),
    name: m.name,
    ensName: m.ensName,
    description: m.description,
    storageHash: m.storageHash,
    axlPeerId: m.axlPeerId,
    strategy: m.strategy,
    salePrice: BigInt(m.salePriceUsdc) * USDC_SCALE,
    rentalPricePerDay: BigInt(m.rentalPricePerDayUsdc) * USDC_SCALE,
    isOnline: m.online,
    owner,
    currentRenter: null,
    rentalExpiry: null,
  };
}

export function listingSaleUsdc(listing: Listing): number {
  return Number(listing.salePrice / USDC_SCALE);
}

export function listingRentPerDayUsdc(listing: Listing): number {
  return Number(listing.rentalPricePerDay / USDC_SCALE);
}

async function getBaseListings(): Promise<Listing[]> {
  const registry = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT;
  if (registry && registry.length > 10) {
    try {
      return await fetchRegistryListings();
    } catch {
      /* fallback mock */
    }
  }
  return MOCK_LISTINGS.map(mockToListing);
}

function normalizeStrategy(
  s: string | null | undefined,
  fallback: StrategyMode,
): StrategyMode {
  const allowed: StrategyMode[] = [
    "conservative",
    "aggressive",
    "research",
    "custom",
  ];
  if (s && allowed.includes(s as StrategyMode)) {
    return s as StrategyMode;
  }
  return fallback;
}

async function enrichWithEns(listings: Listing[]): Promise<Listing[]> {
  return Promise.all(
    listings.map(async (l) => {
      const resolved = await resolveAgentRecords(l.ensName);
      if (!resolved) return l;
      return {
        ...l,
        storageHash: resolved.storageHash ?? l.storageHash,
        strategy: normalizeStrategy(resolved.strategy, l.strategy),
        axlPeerId: resolved.axlPeerId ?? l.axlPeerId,
      };
    }),
  );
}

export async function getListings(): Promise<Listing[]> {
  const base = await getBaseListings();
  return enrichWithEns(base);
}

export async function getListingByName(name: string): Promise<Listing | null> {
  const listings = await getListings();
  return listings.find((l) => l.name === name) ?? null;
}

export async function getOwnedByWallet(
  address: `0x${string}` | undefined,
): Promise<Listing[]> {
  if (!address) return [];

  const registry = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT;
  const inft = process.env.NEXT_PUBLIC_INFT_CONTRACT;
  if (
    registry &&
    inft &&
    registry.startsWith("0x") &&
    inft.startsWith("0x")
  ) {
    const { fetchOwnedTokenIds } = await import("@/lib/contracts/inft");
    const ownedIds = new Set(
      (await fetchOwnedTokenIds(address)).map((id) => id.toString()),
    );
    if (ownedIds.size === 0) {
      return [];
    }
    const listings = await getListings();
    return listings.filter((l) => ownedIds.has(l.tokenId.toString()));
  }

  const listings = await getListings();
  return listings.filter(
    (l) => l.owner.toLowerCase() === address.toLowerCase(),
  );
}

export async function getRentedByWallet(
  address: `0x${string}` | undefined,
): Promise<(Listing & { rentalExpiry: number })[]> {
  if (!address) return [];

  const registry = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT;
  if (registry && registry.startsWith("0x")) {
    const { fetchRentedTokenIds } = await import("@/lib/contracts/registry");
    const rentedIds = new Set(
      (await fetchRentedTokenIds(address)).map((i) => i.toString()),
    );
    if (rentedIds.size === 0) return [];
    const listings = await getListings();
    return listings
      .filter(
        (l) =>
          rentedIds.has(l.tokenId.toString()) &&
          l.currentRenter &&
          l.currentRenter.toLowerCase() === address.toLowerCase() &&
          l.rentalExpiry != null &&
          l.rentalExpiry > Math.floor(Date.now() / 1000),
      )
      .map((l) => ({
        ...l,
        rentalExpiry: l.rentalExpiry!,
      }));
  }

  const listings = await getListings();
  return listings
    .filter(
      (l) =>
        l.currentRenter &&
        l.currentRenter.toLowerCase() === address.toLowerCase() &&
        l.rentalExpiry != null &&
        l.rentalExpiry > Math.floor(Date.now() / 1000),
    )
    .map((l) => ({
      ...l,
      rentalExpiry: l.rentalExpiry!,
    }));
}
