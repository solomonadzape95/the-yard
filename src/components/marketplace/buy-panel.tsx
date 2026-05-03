"use client";

import { useCallback, useEffect, useState } from "react";
import type { Address } from "viem";
import { maxUint256 } from "viem";
import { useAccount, useChainId, useConfig, useSwitchChain, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { getZgChain } from "@/lib/chains";
import { ERC20_ABI, REGISTRY_ABI } from "@/lib/contracts/abis";
import type { ListingDTO } from "@/lib/listing-serde";
import { getUniswapQuote, formatUsdcFromAtomic } from "@/lib/uniswap";

function contractAddresses() {
  const registry = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT;
  const usdc = process.env.NEXT_PUBLIC_USDC_CONTRACT;
  return {
    registry:
      registry?.startsWith("0x") && registry.length === 42
        ? (registry as Address)
        : undefined,
    usdc:
      usdc?.startsWith("0x") && usdc.length === 42 ? (usdc as Address) : undefined,
  };
}

export function BuyPanel({ listing }: { listing: ListingDTO }) {
  const config = useConfig();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending, error } = useWriteContract();

  const zg = getZgChain();
  const { registry, usdc } = contractAddresses();

  const [quoteLabel, setQuoteLabel] = useState<string | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const saleAtomic = BigInt(listing.salePrice);
  const amountUsdcText = formatUsdcFromAtomic(saleAtomic);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setQuoteLoading(true);
      const q = await getUniswapQuote({ amountInUsdcAtomic: saleAtomic });
      if (!cancelled) {
        setQuoteLabel(
          q ? `Indicative out (mainnet quote): ${q.amountOutHuman}` : "Quote unavailable",
        );
      }
      setQuoteLoading(false);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [saleAtomic]);

  const contractsReady = Boolean(registry && usdc && zg);
  const wrongChain = zg && chainId !== zg.id;
  const notForSale = saleAtomic === 0n;

  const buy = useCallback(async () => {
    if (!address || !registry || !usdc || !zg) return;
    if (chainId !== zg.id && switchChainAsync) {
      await switchChainAsync({ chainId: zg.id });
    }

    const aHash = await writeContractAsync({
      chainId: zg.id,
      address: usdc,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [registry, maxUint256],
    });
    await waitForTransactionReceipt(config, { hash: aHash, chainId: zg.id });

    await writeContractAsync({
      chainId: zg.id,
      address: registry,
      abi: REGISTRY_ABI,
      functionName: "purchaseAgent",
      args: [BigInt(listing.tokenId), saleAtomic],
    });
  }, [
    address,
    registry,
    usdc,
    zg,
    chainId,
    switchChainAsync,
    writeContractAsync,
    config,
    listing.tokenId,
    saleAtomic,
  ]);

  return (
    <div className="space-y-3 border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Buy</p>
      <TextField label="Amount (USDC)" value={amountUsdcText} readOnly />
      <p className="text-xs text-[var(--color-muted)]">
        Seller must have approved the registry to transfer this NFT. You approve USDC,
        then call purchase.
      </p>
      <p className="text-xs text-[var(--color-muted)]">
        You pay {amountUsdcText} USDC {"->"}{" "}
        {quoteLoading ? "Fetching quote…" : quoteLabel ?? "—"} (live Uniswap API on
        mainnet; settlement is USDC on 0G registry).
      </p>
      {error && (
        <p className="text-xs text-rose-300">{error.message.slice(0, 200)}</p>
      )}
      {!zg && (
        <p className="text-xs text-[var(--color-muted)]">
          Set NEXT_PUBLIC_OG_CHAIN_ID and NEXT_PUBLIC_OG_RPC_URL for your 0G deployment.
        </p>
      )}
      {wrongChain && zg && (
        <Button
          type="button"
          variant="secondary"
          onClick={() => switchChainAsync?.({ chainId: zg.id })}
        >
          Switch to {zg.name}
        </Button>
      )}
      {zg && (!registry || !usdc) && (
        <p className="text-xs text-[var(--color-muted)]">
          Set NEXT_PUBLIC_REGISTRY_CONTRACT and NEXT_PUBLIC_USDC_CONTRACT to enable
          transactions.
        </p>
      )}
      {notForSale && (
        <p className="text-xs text-[var(--color-muted)]">This listing is not for sale.</p>
      )}
      <Button
        type="button"
        variant="primary"
        onClick={() => void buy()}
        className={
          !contractsReady || !address || notForSale
            ? "pointer-events-none opacity-50"
            : ""
        }
      >
        {isPending ? "…" : "Buy now (approve + purchase)"}
      </Button>
    </div>
  );
}
