/** Indicative Uniswap quote (mainnet API). Purchase settles in USDC on 0G registry. */

export type QuoteResult = {
  amountOutHuman: string;
  raw?: Record<string, unknown>;
};

const WETH_MAINNET = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC_MAINNET = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export async function getUniswapQuote(params: {
  amountInUsdcAtomic: bigint;
}): Promise<QuoteResult | null> {
  const amount = params.amountInUsdcAtomic.toString();
  const chainId = 1;

  const url = new URL("https://api.uniswap.org/v2/quote");
  url.searchParams.set("tokenInAddress", USDC_MAINNET);
  url.searchParams.set("tokenOutAddress", WETH_MAINNET);
  url.searchParams.set("amount", amount);
  url.searchParams.set("type", "exactIn");
  url.searchParams.set("chainId", String(chainId));

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, unknown>;
    const out =
      (json.quoteDecimals as string | undefined) ??
      (json.amountOut as string | undefined);
    return {
      amountOutHuman: out ?? JSON.stringify(json).slice(0, 80),
      raw: json,
    };
  } catch {
    return null;
  }
}

export function formatUsdcFromAtomic(amount: bigint): string {
  return (Number(amount) / 1e6).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}
