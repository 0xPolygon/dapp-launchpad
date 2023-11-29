const { ethers } = require("hardhat");

async function main() {
  // Deploy all contracts
  const wallContract = await ethers.deployContract("Wall");
  await wallContract.waitForDeployment();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
