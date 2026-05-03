# the yard — Hackathon Build Plan & Requirements

> **Tagline:** Own your robot. Rent your agent. No middleman, no master switch.
>
> A decentralized marketplace where AI agents are minted as iNFTs (ERC-7857), discovered via ENS names, test-driven over P2P AXL connections, purchased/rented using Uniswap, and executed reliably through KeeperHub — all backed by 0G decentralized storage and compute.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prize Strategy](#2-prize-strategy)
3. [Architecture Overview](#3-architecture-overview)
4. [Tech Stack Reference](#4-tech-stack-reference)
5. [Deliverable 1 — Creator Dashboard](#5-deliverable-1--creator-dashboard)
6. [Deliverable 2 — Agent Marketplace](#6-deliverable-2--agent-marketplace)
7. [Deliverable 3 — Reference Worker Agent](#7-deliverable-3--reference-worker-agent)
8. [Smart Contracts](#8-smart-contracts)
9. [Data Models](#9-data-models)
10. [Integration Details](#10-integration-details)
11. [Hackathon Scope Cuts](#11-hackathon-scope-cuts)
12. [Build Order & Milestones](#12-build-order--milestones)
13. [Submission Checklist](#13-submission-checklist)

---

## 1. Project Overview

the yard is a decentralized marketplace for autonomous AI agents. Unlike centralized AI stores (ChatGPT's GPT store, etc.) where you "license" access to an agent on someone else's server:

- **Ownership is real** — agents are iNFTs (ERC-7857). Holding the NFT = full control.
- **Storage is decentralized** — agent code, rules, and memory live on 0G Storage, not AWS.
- **Communication is private** — users talk directly to agents via Gensyn AXL (P2P, no central relay).
- **Execution is guaranteed** — agents act onchain through KeeperHub's reliable execution layer.
- **Identity is portable** — every agent has a human-readable ENS name (e.g. `trader-alpha.eth`).

### Core User Flows

**Creator flow:** Build agent → Pack into iNFT → Upload soul to 0G Storage → Set ENS name → List for sale/rent → Receive payment.

**Buyer flow:** Browse marketplace → Test-drive agent via AXL chat → Pay with USDC via Uniswap → Receive iNFT → Agent now listens to them only.

**Renter flow:** Same as buyer, but iNFT access is time-locked. KeeperHub reclaims access on expiry.

---

## 2. Prize Strategy

| Sponsor                | Track                              | Integration                                                                         | Target Prize  |
| ---------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- | ------------- |
| **0G Labs**            | Best Autonomous Agents & iNFT      | iNFT minting (ERC-7857), 0G Storage for agent soul/memory, 0G Compute for inference | $1,500        |
| **Gensyn**             | Best Application of AXL            | P2P agent discovery and test-drive chat via AXL nodes                               | $1,500–$2,500 |
| **Uniswap Foundation** | Best Uniswap API Integration       | All marketplace payments routed through Uniswap API                                 | $1,000–$2,500 |
| **ENS**                | Best ENS Integration for AI Agents | Every agent gets `.eth` name; AXL PeerID + metadata stored in text records          | $500–$1,250   |
| **KeeperHub**          | Best Use of KeeperHub              | Reliable onchain execution for agent trades; rental expiry automation               | $500–$2,500   |

**Realistic total: $5,500–$10,250**

### Why This Wins

Each sponsor integration is **non-cosmetic** — removing any one of them breaks a core user flow. Judges can verify every component is doing real work:

- ENS text records are live and queryable.
- AXL P2P chat is demonstrably not routing through a central server.
- Uniswap API executes real swaps.
- KeeperHub provides an audit trail of agent actions.
- 0G Storage has verifiable upload hashes.

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Next.js Frontend                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Creator     │  │  Marketplace │  │  My Agents│ │
│  │  Dashboard   │  │  Gallery     │  │  Panel    │ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬─────┘ │
└─────────┼────────────────┼────────────────┼─────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────┐
│              Registry Smart Contract                │
│  (Tracks listings, rental periods, ownership)       │
└────┬────────────┬──────────────┬───────────────┬────┘
     │            │              │               │
     ▼            ▼              ▼               ▼
┌─────────┐ ┌─────────┐ ┌──────────────┐ ┌──────────┐
│ 0G      │ │ ENS     │ │ Uniswap API  │ │KeeperHub │
│ Storage │ │ .eth    │ │ (payments)   │ │(execute) │
│ (soul/  │ │ names + │ │              │ │(rental   │
│ memory) │ │ records │ │              │ │ expiry)  │
└─────────┘ └─────────┘ └──────────────┘ └──────────┘
     │
     ▼
┌─────────────────────────────────────────────────────┐
│              Gensyn AXL Node (local)                │
│   P2P encrypted channel for test-drive chat         │
│   Agent discovered via AXL PeerID in ENS record     │
└─────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────┐
│         Reference Worker Agent (Node.js)            │
│   - Listens on AXL for user messages                │
│   - Reads/writes memory from 0G Storage             │
│   - Executes trades via KeeperHub MCP               │
│   - Responds to iNFT owner only                     │
└─────────────────────────────────────────────────────┘
```

---

## 4. Tech Stack Reference

### Frontend

- **Next.js 14+** with TypeScript and App Router
- **Tailwind CSS** for styling (Apple-style: clean, white, generous whitespace)
- **wagmi + viem** for wallet connection and contract interaction (supports MetaMask, WalletConnect)
- **shadcn/ui** for base components

### Blockchain

- **Network:** 0G Chain (EVM-compatible) for all contract deployments
- **iNFT Standard:** ERC-7857 — the agent's "deed of ownership"
- **Registry Contract:** Custom Solidity contract (see Section 8)
- **ENS:** Standard ENS contracts (Sepolia or mainnet depending on judge preference)

### 0G Labs

- **SDK:** `@0glabs/0g-ts-sdk`
- **0G Storage:** Agent soul files (WASM/JSON), memory logs
- **0G Compute:** Inference endpoint for agent reasoning (models: `qwen3.6-plus` or `GLM-5-FP8`)
- **0G DA:** Data availability layer for large memory blobs

### Gensyn AXL

- **AXL binary:** Single binary, runs locally, HTTP to localhost
- **Uses:** P2P test-drive chat channel, agent-to-user messaging
- **Agent discovery:** AXL PeerID stored in ENS text record `axl-peer-id`

### Uniswap

- **Uniswap API:** REST API for quote + swap execution
- **Use:** Marketplace payments. Buyer pays USDC → auto-swapped to seller's preferred token
- **FEEDBACK.md:** Required file in repo root (submission requirement)

### ENS

- **SDK:** `@ensdomains/ensjs`
- **Use:** Each agent gets `agentname.eth`. Text records store: `axl-peer-id`, `strategy`, `last-action`, `owner-wallet`
- **Resolution:** Marketplace looks up agents by ENS name

### KeeperHub

- **Integration:** MCP server for agent tool use (wallet access, tx submission)
- **CLI:** Used for registering automation triggers (rental expiry)
- **Use:** Reference agent submits all trades through KeeperHub for guaranteed execution + audit

### Agent Runtime

- **Node.js** process running the Worker Agent
- **Connects to:** AXL (via localhost HTTP), 0G Storage SDK, KeeperHub MCP
- **Authentication:** Checks iNFT ownership before responding to any command

---

## 5. Deliverable 1 — Creator Dashboard

### Purpose

A clean web interface where developers "pack" their AI agent into an iNFT and list it.

### Pages & Components

#### `/create` — Agent Packer

**Step 1: Define Your Agent**

- Input: Agent name (becomes the ENS subdomain)
- Input: Short description (max 280 chars)
- Input: Personality/system prompt (textarea)
- Input: Strategy mode (dropdown: `conservative`, `aggressive`, `research`, `custom`)
- Input: Pricing — Sale price (ETH/USDC) and/or Rental price (USDC/day)

**Step 2: Upload Agent Soul**

- File upload: Agent code/config as a JSON bundle
- On submit: Upload to 0G Storage via SDK, receive `storageHash`
- Show: Upload progress bar, final 0G Storage hash

**Step 3: Mint iNFT**

- Button: "Mint Agent as iNFT"
- Action: Calls `mintAgent(storageHash, ensName, price, rentalPricePerDay)` on Registry Contract
- Wallet signs transaction, iNFT minted to creator's address
- Show: Transaction hash, link to 0G explorer

**Step 4: Register ENS Name**

- Auto-registers `agentname.eth` (or subdomain of a project ENS)
- Sets text records:
  - `storage-hash` → 0G Storage hash of agent soul
  - `strategy` → selected strategy mode
  - `axl-peer-id` → filled after agent node starts (see Step 5)
  - `marketplace-contract` → Registry contract address
- Show: ENS explorer link

**Step 5: Start Agent Node (Instructions)**

- Display: `npm install && node agent.js --name agentname --inft-id <tokenId>`
- When agent starts, it registers its AXL PeerID and auto-updates the ENS text record
- Show: "Waiting for agent to come online..." → green checkmark when ENS `axl-peer-id` is set

**Step 6: Confirm Listing**

- Summary card: name, ENS, price, rental price, 0G Storage hash, iNFT token ID
- Button: "Publish Listing" → writes to Registry contract's public listing mapping

---

#### `/my-agents` — Creator's Dashboard

- Table of all iNFTs minted by connected wallet
- Columns: Agent name, ENS, status (listed/unlisted/rented), rental expiry, earnings
- Actions: Update listing price, delist, view memory logs (fetched from 0G Storage)

---

## 6. Deliverable 2 — Agent Marketplace

### Purpose

A gallery where users browse, test-drive, buy, and rent agents.

### Pages & Components

#### `/marketplace` — Agent Gallery

- Grid of agent cards, each showing:
  - Agent avatar (generated from ENS name hash for uniqueness)
  - ENS name (e.g. `trader-alpha.eth`)
  - Short description
  - Strategy badge (color-coded)
  - Sale price / Rental price per day
  - Online indicator (green dot if AXL PeerID is reachable)
  - "Test Drive" button (only if agent is online)
  - "Buy" / "Rent" buttons

- Filters: Strategy type, price range, online only, owned by me

---

#### `/marketplace/[agentName]` — Agent Detail Page

**Left panel: Agent profile**

- Large ENS avatar
- Full description
- ENS text records displayed as live metadata (strategy, last-action, owner)
- Link to 0G Storage hash (verifiable soul)
- Link to KeeperHub audit trail (agent's past actions)
- iNFT token ID + 0G Explorer link

**Right panel: Actions**

_Test Drive (if agent is online):_

- Button opens a chat drawer
- Chat routes via AXL: frontend → local AXL node → agent's AXL PeerID
- Agent responds in real time (limited to 5 messages for test-drive)
- Label clearly shows: "This conversation is P2P via Gensyn AXL — not routed through any server"

_Buy:_

- Input: Amount in USDC
- Uniswap API fetches a quote for USDC → seller's preferred token
- Shows: "You pay X USDC → Seller receives Y TOKEN"
- Button: "Buy Now" → calls Uniswap swap + Registry `purchaseAgent(tokenId)` in sequence
- On success: iNFT transferred to buyer's wallet

_Rent:_

- Input: Number of days
- Shows: Total cost in USDC
- Button: "Rent" → Uniswap swap + Registry `rentAgent(tokenId, days)`
- KeeperHub automation registered for rental expiry date

---

#### `/my-agents` (Buyer view) — Owned & Rented Agents

- Two tabs: "Owned" and "Rented"
- Each card shows:
  - Agent name, ENS, status
  - For rented: countdown to expiry
  - Button: "Open Chat" → direct AXL chat (no 5-message limit for owners)
  - Button: "View Memory" → fetches conversation log from 0G Storage (owner-only silo)
  - For owned: "Relist for Rent" option

---

## 7. Deliverable 3 — Reference Worker Agent

### Purpose

A working agent that proves the platform functions end-to-end. This is both the demo centerpiece and the example agent required by 0G's submission rules.

### What It Does

- Listens for messages via AXL
- Responds to owner's natural language commands
- Can execute Uniswap token swaps via KeeperHub
- Maintains persistent memory on 0G Storage (conversation log + trade history)
- Refuses commands from non-owners (checks iNFT ownership on 0G Chain)

### Startup Sequence

```
1. Load agent config from 0G Storage (using storageHash from env)
2. Connect to AXL node (localhost:8080)
3. Register AXL PeerID → push to ENS text record via SDK
4. Connect to KeeperHub MCP server
5. Start listening for messages
```

### Message Handling Loop

```
Incoming AXL message
  → Verify sender owns iNFT (query 0G Chain / ERC-7857)
  → If not owner: reply "Unauthorized. This agent only responds to its owner."
  → If owner:
      → Load memory from 0G Storage KV (last N messages)
      → Build prompt: system_prompt + memory + user_message
      → Call 0G Compute inference (qwen3.6-plus or GLM-5-FP8)
      → If response contains a trade action:
          → Submit via KeeperHub MCP (not directly — KeeperHub handles gas/retry)
      → Append exchange to 0G Storage Log (memory silo)
      → Send response back via AXL
```

### Agent Commands (Demo)

The reference agent understands these natural language commands:

| User Says                       | Agent Does                               |
| ------------------------------- | ---------------------------------------- |
| "Swap 10 USDC for ETH"          | Submits swap via KeeperHub → Uniswap     |
| "What did you do today?"        | Reads today's memory log from 0G Storage |
| "What's my ETH balance?"        | Queries wallet balance on 0G Chain       |
| "Stop trading, hold everything" | Updates strategy flag in 0G Storage KV   |

### Memory Schema (0G Storage)

```json
{
  "kv": {
    "owner": "0x...",
    "inft_id": "42",
    "strategy": "conservative",
    "last_action": "swap 10 USDC → ETH at 12:34 UTC",
    "session_message_count": 7
  },
  "log": [
    {
      "timestamp": "2026-01-01T12:34:00Z",
      "role": "user",
      "content": "Swap 10 USDC for ETH"
    },
    {
      "timestamp": "2026-01-01T12:34:05Z",
      "role": "agent",
      "content": "Done. Swapped 10 USDC → 0.003 ETH via KeeperHub. TX: 0x..."
    }
  ]
}
```

---

## 8. Smart Contracts

All contracts deployed on **0G Chain** (EVM-compatible).

### A. iNFT Contract (ERC-7857)

Use or extend the existing ERC-7857 reference implementation. Key additions:

```solidity
// Additional fields on top of ERC-7857
struct AgentMetadata {
    string storageHash;      // 0G Storage hash of agent soul
    string ensName;          // e.g. "trader-alpha.eth"
    string axlPeerId;        // Gensyn AXL peer ID
    uint256 salePrice;       // 0 = not for sale
    uint256 rentalPricePerDay;
    address currentRenter;
    uint256 rentalExpiry;    // Unix timestamp
}
```

### B. Registry Contract

```solidity
contract the yardRegistry {
    // List an agent for sale/rent
    function listAgent(
        uint256 tokenId,
        uint256 salePrice,
        uint256 rentalPricePerDay
    ) external;

    // Purchase agent (transfers iNFT)
    function purchaseAgent(uint256 tokenId) external payable;

    // Rent agent (time-locks access, KeeperHub registers expiry)
    function rentAgent(uint256 tokenId, uint256 days) external payable;

    // Called by KeeperHub on rental expiry
    function expireRental(uint256 tokenId) external onlyKeeper;

    // Query: does this address own or currently rent this agent?
    function hasAccess(uint256 tokenId, address user) external view returns (bool);
}
```

**Key design notes:**

- `expireRental` is whitelisted to KeeperHub's address only
- Payment in USDC, converted to seller's token via Uniswap API before transfer
- `hasAccess` is what the agent checks on every incoming message

---

## 9. Data Models

### Agent Listing (Frontend State)

```typescript
interface AgentListing {
  tokenId: string;
  name: string; // e.g. "trader-alpha"
  ensName: string; // e.g. "trader-alpha.eth"
  description: string;
  storageHash: string; // 0G Storage
  axlPeerId: string; // from ENS text record
  strategy: "conservative" | "aggressive" | "research" | "custom";
  salePrice: bigint; // in USDC (0 = not for sale)
  rentalPricePerDay: bigint;
  owner: `0x${string}`;
  currentRenter: `0x${string}` | null;
  rentalExpiry: Date | null;
  isOnline: boolean; // derived from AXL ping
}
```

### ENS Text Records Schema

| Record Key             | Value                         | Example              |
| ---------------------- | ----------------------------- | -------------------- |
| `storage-hash`         | 0G Storage hash of agent soul | `bafk...xyz`         |
| `strategy`             | Agent strategy mode           | `conservative`       |
| `last-action`          | Last action taken by agent    | `swap 10 USDC → ETH` |
| `axl-peer-id`          | Gensyn AXL peer ID            | `12D3Koo...`         |
| `marketplace-contract` | Registry contract address     | `0x...`              |
| `inft-token-id`        | ERC-7857 token ID             | `42`                 |

---

## 10. Integration Details

### 0G Storage Integration

```typescript
import { ZeroGStorage } from "@0glabs/0g-ts-sdk";

const storage = new ZeroGStorage({ rpc: process.env.OG_RPC_URL });

// Upload agent soul
async function uploadAgentSoul(soulJson: object): Promise<string> {
  const buffer = Buffer.from(JSON.stringify(soulJson));
  const { hash } = await storage.upload(buffer);
  return hash; // Store this as the iNFT's storageHash
}

// Read agent soul (on agent startup)
async function loadAgentSoul(storageHash: string): Promise<object> {
  const buffer = await storage.download(storageHash);
  return JSON.parse(buffer.toString());
}

// Append to memory log
async function appendMemory(
  agentId: string,
  entry: MemoryEntry,
): Promise<void> {
  await storage.log.append(`agent:${agentId}:log`, JSON.stringify(entry));
}

// Update KV state
async function updateState(
  agentId: string,
  key: string,
  value: string,
): Promise<void> {
  await storage.kv.set(`agent:${agentId}:${key}`, value);
}
```

### Gensyn AXL Integration

```typescript
// AXL runs as a local binary. Communicate via HTTP to localhost.

// Start AXL node (run via shell before starting agent)
// $ axl start --port 8080

// Register as a peer and get PeerID
const peerResponse = await fetch("http://localhost:8080/peer/id");
const { peerId } = await peerResponse.json();

// Send a message to another peer
async function sendToAgent(peerId: string, message: string) {
  await fetch("http://localhost:8080/send", {
    method: "POST",
    body: JSON.stringify({ to: peerId, message }),
    headers: { "Content-Type": "application/json" },
  });
}

// Listen for incoming messages (agent side)
const ws = new WebSocket("ws://localhost:8080/listen");
ws.onmessage = (event) => {
  const { from, message } = JSON.parse(event.data);
  handleIncomingMessage(from, message);
};
```

### Uniswap API Integration

```typescript
// Get a swap quote
async function getSwapQuote(
  amountIn: string,
  tokenIn: string,
  tokenOut: string,
) {
  const response = await fetch(
    `https://api.uniswap.org/v2/quote?` +
      `tokenInAddress=${tokenIn}&tokenOutAddress=${tokenOut}` +
      `&amount=${amountIn}&type=exactIn&chainId=1`,
  );
  return response.json();
}

// Execute a swap (called by agent via KeeperHub)
async function executeSwap(quote: SwapQuote, walletClient: WalletClient) {
  // Submit swap calldata to KeeperHub MCP rather than directly
  // KeeperHub handles retry, gas estimation, MEV protection
  await keeperHub.submitTransaction({
    to: quote.routerAddress,
    data: quote.calldata,
    value: quote.value,
  });
}
```

### ENS Integration

```typescript
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http } from "viem";
import { mainnet } from "viem/chains";

const ensClient = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

// Register agent ENS name and set text records
async function registerAgentENS(
  agentName: string,
  records: Record<string, string>,
) {
  // Register agentName.eth (or agentName.the yard.eth if using subdomain)
  // Set text records
  for (const [key, value] of Object.entries(records)) {
    await ensClient.setTextRecord({ name: `${agentName}.eth`, key, value });
  }
}

// Resolve agent by ENS name (for marketplace discovery)
async function resolveAgent(ensName: string) {
  const axlPeerId = await ensClient.getTextRecord({
    name: ensName,
    key: "axl-peer-id",
  });
  const storageHash = await ensClient.getTextRecord({
    name: ensName,
    key: "storage-hash",
  });
  const strategy = await ensClient.getTextRecord({
    name: ensName,
    key: "strategy",
  });
  return { axlPeerId, storageHash, strategy };
}
```

### KeeperHub Integration

```typescript
// Via KeeperHub MCP server
// The agent connects to KeeperHub's MCP endpoint for wallet access

const keeperHub = new KeeperHubMCPClient({
  endpoint: process.env.KEEPERHUB_MCP_URL,
  apiKey: process.env.KEEPERHUB_API_KEY,
});

// Submit a transaction (with retry, gas optimization, audit trail)
async function submitTrade(txData: TransactionData) {
  const result = await keeperHub.submitTransaction(txData);
  // result.txHash is logged to 0G Storage memory
  return result;
}

// Register rental expiry automation (called when rental is created)
async function registerRentalExpiry(tokenId: string, expiryTimestamp: number) {
  await keeperHub.scheduleCall({
    contractAddress: REGISTRY_CONTRACT_ADDRESS,
    functionName: "expireRental",
    args: [tokenId],
    triggerAt: expiryTimestamp,
  });
}
```

---

## 11. Hackathon Scope Cuts

These features are **intentionally deferred** to keep the build shippable. Do not build these unless all core flows are complete.

| Full Vision                                  | Hackathon Version                                                 |
| -------------------------------------------- | ----------------------------------------------------------------- |
| Memory wipe on rental expiry (cryptographic) | Memory silo flag — renter's silo is simply not shown after expiry |
| Multi-currency Uniswap swap from any token   | USDC → seller's preferred token only                              |
| Agent breeding/merging via iNFTs             | Not implemented                                                   |
| No-code visual agent builder                 | Creator dashboard uses JSON config upload                         |
| Full rental expiry with memory wipe          | KeeperHub calls `expireRental`, which flips an access flag        |
| Fully decentralized frontend (IPFS)          | Vercel deployment is fine for hackathon                           |
| Multiple agent models                        | One reference agent runtime (Node.js)                             |

---

## 12. Build Order & Milestones

Build in this exact order. Each milestone produces a demoable artifact.

### Phase 1 — Foundation (Day 1)

**Goal:** Smart contracts deployed, iNFT mintable, 0G Storage working.

- [ ] Set up Next.js + TypeScript + Tailwind project
- [ ] Install: `wagmi`, `viem`, `@0glabs/0g-ts-sdk`, `@ensdomains/ensjs`, `shadcn/ui`
- [ ] Deploy iNFT (ERC-7857) contract to 0G Chain testnet
- [ ] Deploy Registry contract to 0G Chain testnet
- [ ] Test: Upload a JSON file to 0G Storage, get back a hash
- [ ] Test: Mint an iNFT with that storage hash

**Deliverable:** Can mint an iNFT linked to a 0G Storage file. Screenshot this.

---

### Phase 2 — Agent Core (Day 1–2)

**Goal:** Reference Worker Agent running and accessible via AXL.

- [ ] Set up AXL node locally (`axl start`)
- [ ] Build `agent.js`: starts, reads soul from 0G Storage, registers AXL PeerID
- [ ] Implement ownership check: `hasAccess(tokenId, senderAddress)` via contract call
- [ ] Implement basic message loop: receive via AXL → infer via 0G Compute → respond via AXL
- [ ] Implement memory read/write to 0G Storage
- [ ] Register ENS name for test agent, write `axl-peer-id` to text record

**Deliverable:** Can chat with the agent via AXL. It knows who owns it and remembers conversations.

---

### Phase 3 — Marketplace UI (Day 2)

**Goal:** Users can browse and test-drive agents.

- [ ] Build `/marketplace` page — agent gallery with cards
- [ ] Build agent detail page — show ENS metadata, 0G Storage hash
- [ ] Build Test Drive chat drawer — routes messages via AXL to agent
- [ ] Add "Online" indicator — ping agent's AXL PeerID
- [ ] Wire up ENS resolution for agent discovery

**Deliverable:** Open browser, see agents, click test-drive, chat with the agent live.

---

### Phase 4 — Transactions (Day 2–3)

**Goal:** Users can buy/rent agents with real payments.

- [ ] Integrate Uniswap API — fetch quote for USDC → token
- [ ] Build Buy flow — Uniswap swap + `purchaseAgent()` on Registry contract
- [ ] Build Rent flow — Uniswap swap + `rentAgent()` + KeeperHub expiry registration
- [ ] Build My Agents panel — show owned and rented agents with expiry countdown
- [ ] Create `FEEDBACK.md` for Uniswap (required for prize eligibility)

**Deliverable:** Complete purchase flow, iNFT transfers to buyer's wallet.

---

### Phase 5 — Agent Trades & Polish (Day 3)

**Goal:** Agent can execute onchain trades via KeeperHub. Demo is polished.

- [ ] Connect KeeperHub MCP to agent runtime
- [ ] Implement "Swap X for Y" command in agent (routes through KeeperHub)
- [ ] Log trade results to 0G Storage memory
- [ ] Build Creator Dashboard — upload soul, mint iNFT, set ENS, start agent
- [ ] Polish UI — loading states, error messages, mobile responsive
- [ ] Record demo video (under 3 minutes)

**Deliverable:** Full end-to-end demo: create agent → list it → buy it → command it to swap tokens → see trade on KeeperHub audit trail.

---

## 13. Submission Checklist

### Required by All Sponsors

- [ ] Project name: **the yard**
- [ ] Short description (one paragraph)
- [ ] Contract deployment addresses (iNFT contract + Registry contract on 0G Chain)
- [ ] Public GitHub repo with README and setup instructions
- [ ] Demo video under 3 minutes
- [ ] Live demo link
- [ ] Team member names, Telegram handles, X handles
- [ ] Explain which protocol features and SDKs were used (per-sponsor section in README)

### 0G-Specific

- [ ] At least one working example agent (our Reference Worker Agent qualifies)
- [ ] iNFT minted on 0G Chain, proof link
- [ ] Explanation of how agent intelligence/memory is embedded in 0G Storage

### Uniswap-Specific

- [ ] `FEEDBACK.md` in repo root (required for prize eligibility — fill this out honestly)

### KeeperHub-Specific

- [ ] Working demo showing KeeperHub execution
- [ ] Brief write-up in README on how KeeperHub is used (trade execution + rental expiry)

### ENS-Specific

- [ ] Video/live demo showing ENS resolution working for agent discovery
- [ ] ENS name resolves to agent address, text records are live and queryable

### Gensyn-Specific

- [ ] AXL communication demonstrated across separate nodes (not in-process)
- [ ] README explains AXL setup steps

---

## Environment Variables

```env
# 0G Labs
OG_RPC_URL=https://rpc.0g.ai
OG_STORAGE_RPC=https://storage.0g.ai
OG_COMPUTE_ENDPOINT=https://compute.0g.ai

# Contracts (fill after deployment)
NEXT_PUBLIC_REGISTRY_CONTRACT=0x...
NEXT_PUBLIC_INFT_CONTRACT=0x...

# ENS
ENS_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# KeeperHub
KEEPERHUB_MCP_URL=https://mcp.keeperhub.com
KEEPERHUB_API_KEY=...

# Uniswap
UNISWAP_API_KEY=...

# AXL (local node, no env needed — runs on localhost:8080)
```

---

_Built for the 0G x Multi-Sponsor Hackathon, 2026. This document is the source of truth for the build. When in doubt, refer back to the Prize Strategy section and ask: "Does this feature make a judge's jaw drop, or is it gold-plating?" Ship the jaw-dropper first._
