"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

import { Button } from "@/components/ui/button";

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  if (isConnected && address) {
    return (
      <Button
        variant="secondary"
        onClick={() => disconnect()}
        className="min-w-[140px]"
        type="button"
      >
        {`${address.slice(0, 6)}…${address.slice(-4)}`}
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      type="button"
      className="min-w-[140px]"
      disabled={!connector}
      onClick={() => connector && connect({ connector })}
    >
      {isPending ? "…" : "Connect Wallet"}
    </Button>
  );
}
