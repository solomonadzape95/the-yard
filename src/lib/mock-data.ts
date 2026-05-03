export type StrategyMode = "conservative" | "aggressive" | "research" | "custom";

export interface AgentListing {
  tokenId: string;
  name: string;
  ensName: string;
  description: string;
  storageHash: string;
  axlPeerId: string;
  strategy: StrategyMode;
  salePriceUsdc: number;
  rentalPricePerDayUsdc: number;
  online: boolean;
  owner: string;
  lastAction: string;
}

export const MOCK_LISTINGS: AgentListing[] = [
  {
    tokenId: "101",
    name: "trader-alpha",
    ensName: "trader-alpha.eth",
    description: "Momentum-aware swap assistant for low-touch portfolio moves.",
    storageHash: "0g://8f1a2c9d1-trader-alpha",
    axlPeerId: "12D3KooWAlpha",
    strategy: "aggressive",
    salePriceUsdc: 560,
    rentalPricePerDayUsdc: 35,
    online: true,
    owner: "0xA27C...1f90",
    lastAction: "Swapped 120 USDC -> ETH",
  },
  {
    tokenId: "102",
    name: "yield-keeper",
    ensName: "yield-keeper.eth",
    description: "Conservative allocator that rotates stablecoin yields on schedule.",
    storageHash: "0g://44f7be92f-yield-keeper",
    axlPeerId: "12D3KooWYield",
    strategy: "conservative",
    salePriceUsdc: 430,
    rentalPricePerDayUsdc: 25,
    online: false,
    owner: "0x92F1...aC11",
    lastAction: "Rebalanced stable vault",
  },
  {
    tokenId: "103",
    name: "signal-lens",
    ensName: "signal-lens.eth",
    description: "Research-first signal scanner with explainable reasoning traces.",
    storageHash: "0g://aa12bcde3-signal-lens",
    axlPeerId: "12D3KooWSignal",
    strategy: "research",
    salePriceUsdc: 610,
    rentalPricePerDayUsdc: 40,
    online: true,
    owner: "0x72f2...ff00",
    lastAction: "Published trend memo",
  },
];

export const OWNED_AGENTS = [MOCK_LISTINGS[0], MOCK_LISTINGS[2]];

export const RENTED_AGENTS = [
  {
    ...MOCK_LISTINGS[1],
    expiresIn: "2d 14h",
  },
];
