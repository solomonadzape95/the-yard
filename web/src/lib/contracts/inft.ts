import { createPublicClient, http, type Address } from "viem";

import { ERC721_ENUMERABLE_ABI } from "@/lib/contracts/abis";

function getInftAddress(): Address | undefined {
  const a = process.env.NEXT_PUBLIC_INFT_CONTRACT;
  if (!a || !a.startsWith("0x") || a.length !== 42) return undefined;
  return a as Address;
}

function getOgRpc(): string | undefined {
  return process.env.NEXT_PUBLIC_OG_RPC_URL;
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

export async function fetchOwnedTokenIds(user: Address): Promise<bigint[]> {
  const nft = getInftAddress();
  const rpc = getOgRpc();
  if (!nft || !rpc) return [];

  const client = createPublicClient({
    chain: ogChain(),
    transport: http(rpc),
  });

  const balance = await client.readContract({
    address: nft,
    abi: ERC721_ENUMERABLE_ABI,
    functionName: "balanceOf",
    args: [user],
  });

  const n = Number(balance);
  const ids: bigint[] = [];
  for (let i = 0; i < n; i++) {
    const id = await client.readContract({
      address: nft,
      abi: ERC721_ENUMERABLE_ABI,
      functionName: "tokenOfOwnerByIndex",
      args: [user, BigInt(i)],
    });
    ids.push(id);
  }
  return ids;
}
