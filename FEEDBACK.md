# Uniswap integration feedback (the yard)

This file is a lightweight submission artifact for the Uniswap Foundation track.

## What we integrated

- **Quote API:** The marketplace Buy panel calls the public Uniswap quote endpoint to show an indicative output amount when a buyer enters/offers USDC for an agent purchase. Settlement on the hackathon path is **USDC paid directly to the registry contract** on the target chain (0G testnet) rather than executing the quoted swap on L1.

## What worked well

- The quote endpoint was straightforward to call from a Next.js client component with a simple `fetch`, which made it easy to surface a believable “You pay X USDC → seller-facing token exposure Y” line in the UI without wiring full swap calldata execution.

## Friction / limitations

- **Chain mismatch:** Quotes are resolved against mainnet-style liquidity by default, while our registry transactions are designed for a different EVM chain (0G). The UI labels this as an **indicative** quote to avoid misleading users.
- **Execution scope:** We intentionally did not bundle swap execution into the purchase transaction to save integration time; the registry accepts USDC directly.

## Suggestions

- A small docs section on “how to interpret quotes when the trading chain differs from the settlement chain” would help hackathon teams avoid accidental mis-labeling in the UI.

Thank you for maintaining accessible APIs for hackathon builders.
