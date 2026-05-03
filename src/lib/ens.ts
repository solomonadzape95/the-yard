import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { normalize } from "viem/ens";

export type ResolvedENS = {
  storageHash: string | null;
  strategy: string | null;
  axlPeerId: string | null;
  lastAction: string | null;
};

function getEnsRpc(): string | undefined {
  return process.env.ENS_RPC_URL ?? process.env.NEXT_PUBLIC_ENS_RPC_URL;
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    p,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

export async function resolveAgentRecords(
  ensName: string,
): Promise<ResolvedENS | null> {
  const rpc = getEnsRpc();
  if (!rpc) {
    return null;
  }

  try {
    const name = normalize(ensName as `${string}.eth`);
    const client = createPublicClient({
      chain: sepolia,
      transport: http(rpc),
    });

    const [storageHash, strategy, axlPeerId, lastAction] = await Promise.all([
      withTimeout(
        client.getEnsText({ name, key: "storage-hash" }),
        2000,
      ),
      withTimeout(client.getEnsText({ name, key: "strategy" }), 2000),
      withTimeout(client.getEnsText({ name, key: "axl-peer-id" }), 2000),
      withTimeout(client.getEnsText({ name, key: "last-action" }), 2000),
    ]);

    if (
      !storageHash &&
      !strategy &&
      !axlPeerId &&
      !lastAction
    ) {
      return null;
    }

    return {
      storageHash: storageHash ?? null,
      strategy: strategy ?? null,
      axlPeerId: axlPeerId ?? null,
      lastAction: lastAction ?? null,
    };
  } catch {
    return null;
  }
}
