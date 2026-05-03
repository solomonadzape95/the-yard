"use client";

import { useCallback, useState } from "react";
import type { Address } from "viem";
import { maxUint256 } from "viem";
import { useAccount, useChainId, useConfig, useSwitchChain, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { getZgChain } from "@/lib/chains";
import { ERC20_ABI, REGISTRY_ABI } from "@/lib/contracts/abis";
import type { ListingDTO } from "@/lib/listing-serde";

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

export function RentPanel({ listing }: { listing: ListingDTO }) {
  const config = useConfig();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending, error } = useWriteContract();

  const [days, setDays] = useState("3");

  const zg = getZgChain();
  const { registry, usdc } = contractAddresses();

  const daysBn = BigInt(Math.max(1, Math.min(365, Number.parseInt(days || "1", 10) || 1)));
  const perDay = BigInt(listing.rentalPricePerDay);
  const total = perDay * daysBn;
  const totalLabel = (Number(total) / 1e6).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });

  const contractsReady = Boolean(registry && usdc && zg);
  const wrongChain = zg && chainId !== zg.id;
  const notRentable = perDay === 0n;

  const rent = useCallback(async () => {
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
      functionName: "rentAgent",
      args: [BigInt(listing.tokenId), daysBn, total],
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
    daysBn,
    total,
  ]);

  return (
    <div className="space-y-3 border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">Rent</p>
      <TextField
        label="Days"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        type="number"
        min={1}
      />
      <p className="text-xs text-[var(--color-muted)]">
        Total: {totalLabel} USDC (6 decimals on-chain).
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
      {notRentable && (
        <p className="text-xs text-[var(--color-muted)]">Rent is not enabled for this agent.</p>
      )}
      <Button
        type="button"
        onClick={() => void rent()}
        className={
          !contractsReady || !address || notRentable
            ? "pointer-events-none opacity-50"
            : ""
        }
      >
        {isPending ? "…" : "Rent (approve + rentAgent)"}
      </Button>
    </div>
  );
}
