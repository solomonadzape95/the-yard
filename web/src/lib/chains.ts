import { defineChain } from "viem";
import { mainnet, sepolia } from "viem/chains";

export function getZgChain() {
  const id = Number(process.env.NEXT_PUBLIC_OG_CHAIN_ID ?? "0");
  const rpc = process.env.NEXT_PUBLIC_OG_RPC_URL ?? "";
  if (!id || !rpc) return null;
  return defineChain({
    id,
    name: "0G",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [rpc] } },
  });
}

export function getWagmiChains() {
  const zg = getZgChain();
  if (zg) return [zg, sepolia, mainnet] as const;
  return [mainnet, sepolia] as const;
}
