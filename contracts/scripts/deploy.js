const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  if (!deployer) {
    throw new Error(
      "No deployer signer. For network `og`, set PRIVATE_KEY in contracts/.env (64 hex chars, optional 0x).",
    );
  }

  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  console.log("MockUSDC:", await usdc.getAddress());

  const AgentNFT = await hre.ethers.getContractFactory("AgentNFT");
  const nft = await AgentNFT.deploy(deployer.address);
  await nft.waitForDeployment();
  console.log("AgentNFT:", await nft.getAddress());

  const YardRegistry = await hre.ethers.getContractFactory("YardRegistry");
  const registry = await YardRegistry.deploy(
    await nft.getAddress(),
    await usdc.getAddress(),
  );
  await registry.waitForDeployment();
  console.log("YardRegistry:", await registry.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
