const { task } = require("hardhat/config");
require("hardhat-ethernal");

task("ethernal:reset", "Resets ethernal workspace")
    .addPositionalParam("workspaceName", "Name of the workspace")
    .setAction(async ({ workspaceName }, hre) => {
        await hre.ethernal.resetWorkspace(workspaceName);
    });

task("ethernal:sync-artifact", "Syncs deployed contract's artifact with Ethernal")
    .addPositionalParam("contractName", "Name of the contract")
    .addPositionalParam("contractAddress", "Address of the contract")
    .setAction(async ({ contractName, contractAddress }, hre) => {
        await hre.ethernal.push({
            name: contractName,
            address: contractAddress
        });
    });
