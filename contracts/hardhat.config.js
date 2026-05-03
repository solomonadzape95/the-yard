require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @param {string | undefined} key */
function normalizePrivateKey(key) {
  if (!key || typeof key !== "string") return [];
  const trimmed = key.trim().replace(/^["']|["']$/g, "");
  // Use (0x)? not 0x? — otherwise only keys starting with digit "0" match.
  if (!/^(0x)?[a-fA-F0-9]{64}$/i.test(trimmed)) return [];
  return [trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`];
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {},
    og: {
      url: process.env.OG_RPC_URL || "",
      accounts: normalizePrivateKey(process.env.PRIVATE_KEY),
    },
  },
};
