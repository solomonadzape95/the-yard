import type { Listing } from "@/lib/agent-types";

export type ListingDTO = {
  tokenId: string;
  name: string;
  ensName: string;
  description: string;
  storageHash: string;
  axlPeerId: string;
  strategy: Listing["strategy"];
  salePrice: string;
  rentalPricePerDay: string;
  isOnline: boolean;
  owner: `0x${string}`;
  currentRenter: `0x${string}` | null;
  rentalExpiry: number | null;
  ensResolved: boolean;
};

export function toListingDTO(
  listing: Listing,
  ensResolved: boolean,
): ListingDTO {
  return {
    tokenId: listing.tokenId.toString(),
    name: listing.name,
    ensName: listing.ensName,
    description: listing.description,
    storageHash: listing.storageHash,
    axlPeerId: listing.axlPeerId,
    strategy: listing.strategy,
    salePrice: listing.salePrice.toString(),
    rentalPricePerDay: listing.rentalPricePerDay.toString(),
    isOnline: listing.isOnline,
    owner: listing.owner,
    currentRenter: listing.currentRenter,
    rentalExpiry: listing.rentalExpiry,
    ensResolved,
  };
}

export function listingSaleUsdcFromDto(dto: ListingDTO): number {
  return Number(BigInt(dto.salePrice) / 1_000_000n);
}

export function listingRentPerDayUsdcFromDto(dto: ListingDTO): number {
  return Number(BigInt(dto.rentalPricePerDay) / 1_000_000n);
}
