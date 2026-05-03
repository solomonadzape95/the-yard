import { createPublicClient, http, type Address } from "viem";

import {
  REGISTRY_ABI,
  ERC721_MIN_ABI,
} from "@/lib/contracts/abis";
import type { Listing } from "@/lib/agent-types";
import type { StrategyMode } from "@/lib/mock-data";

function strategyFromUint8(n: number): StrategyMode {
  const modes: StrategyMode[] = [
    "conservative",
    "aggressive",
    "research",
    "custom",
  ];
  return modes[n] ?? "custom";
}

function getRegistryAddress(): Address | undefined {
  const a = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT;
  if (!a || !a.startsWith("0x") || a.length !== 42) return undefined;
  return a as Address;
}

function getOgRpc(): string | undefined {
  return process.env.NEXT_PUBLIC_OG_RPC_URL;
}

function slugFromEns(ensName: string): string {
  return ensName.replace(/\.eth$/, "");
}

function ogChain() {
  const chainId = Number(process.env.NEXT_PUBLIC_OG_CHAIN_ID ?? "0");
  const rpc = getOgRpc() ?? "";
  return {
    id: chainId,
    name: "0G",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [rpc] } },
  };
}

export async function fetchRegistryListings(): Promise<Listing[]> {
  const registry = getRegistryAddress();
  const rpc = getOgRpc();
  if (!registry || !rpc) {
    throw new Error("Registry or RPC not configured");
  }

  const chainId = Number(process.env.NEXT_PUBLIC_OG_CHAIN_ID ?? "0");
  if (!chainId) throw new Error("NEXT_PUBLIC_OG_CHAIN_ID not set");

  const client = createPublicClient({
    chain: ogChain(),
    transport: http(rpc),
  });

  const len = await client.readContract({
    address: registry,
    abi: REGISTRY_ABI,
    functionName: "getListedCount",
  });

  const count = Number(len);
  const listings: Listing[] = [];

  for (let i = 0; i < count; i++) {
    const tokenId = await client.readContract({
      address: registry,
      abi: REGISTRY_ABI,
      functionName: "listedTokenIds",
      args: [BigInt(i)],
    });

    const r = (await client.readContract({
      address: registry,
      abi: REGISTRY_ABI,
      functionName: "getListing",
      args: [tokenId],
    })) as {
      seller: `0x${string}`;
      salePrice: bigint;
      rentalPerDay: bigint;
      listed: boolean;
      renter: `0x${string}`;
      rentalExpiry: bigint;
      ensName: string;
      description: string;
      storageHash: string;
      axlPeerId: string;
      strategy: number;
    };

    const {
      seller,
      salePrice,
      rentalPerDay,
      listed,
      renter,
      rentalExpiry,
      ensName,
      description,
      storageHash,
      axlPeerId,
      strategy: strategyRaw,
    } = r;

    if (!listed) continue;

    const inft = process.env.NEXT_PUBLIC_INFT_CONTRACT as Address | undefined;
    let ownerWallet: `0x${string}` = seller;
    if (inft?.startsWith("0x") && inft.length === 42) {
      ownerWallet = await client.readContract({
        address: inft,
        abi: ERC721_MIN_ABI,
        functionName: "ownerOf",
        args: [tokenId],
      });
    }

    listings.push({
      tokenId,
      name: slugFromEns(ensName),
      ensName,
      description,
      storageHash,
      axlPeerId,
      strategy: strategyFromUint8(Number(strategyRaw)),
      salePrice,
      rentalPricePerDay: rentalPerDay,
      isOnline: false,
      owner: ownerWallet,
      currentRenter:
        renter === "0x0000000000000000000000000000000000000000"
          ? null
          : renter,
      rentalExpiry: rentalExpiry > 0n ? Number(rentalExpiry) : null,
    });
  }

  return listings;
}

export async function fetchHasAccess(
  tokenId: bigint,
  user: `0x${string}`,
): Promise<boolean> {
  const registry = getRegistryAddress();
  const rpc = getOgRpc();
  if (!registry || !rpc) return false;

  const client = createPublicClient({
    chain: ogChain(),
    transport: http(rpc),
  });

  return client.readContract({
    address: registry,
    abi: REGISTRY_ABI,
    functionName: "hasAccess",
    args: [tokenId, user],
  });
}

export async function fetchRentedTokenIds(
  user: Address,
): Promise<bigint[]> {
  const registry = getRegistryAddress();
  const rpc = getOgRpc();
  if (!registry || !rpc) return [];

  const client = createPublicClient({
    chain: ogChain(),
    transport: http(rpc),
  });

  const ids = await client.readContract({
    address: registry,
    abi: REGISTRY_ABI,
    functionName: "rentalsOf",
    args: [user],
  });
  return [...ids];
}
