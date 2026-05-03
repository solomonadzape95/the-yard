"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import type { Chain } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { injected } from "wagmi/connectors";

import { getWagmiChains } from "@/lib/chains";

const chains = getWagmiChains() as unknown as readonly [Chain, ...Chain[]];

const transports = Object.fromEntries(
  chains.map((c) => [c.id, http()]),
) as Record<number, ReturnType<typeof http>>;

const config = createConfig({
  chains,
  connectors: [injected()],
  transports,
});

const queryClient = new QueryClient();

export function AppWagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
