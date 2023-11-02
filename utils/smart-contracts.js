import shell from "shelljs";
import { logErrorWithBg, logSuccessWithBg, logInfoWithBg } from "./print.js";
import { ethers } from "ethers";
import { waitFor } from "./time.js";

// CONSTANTS
const providerLocalBlockchain = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

/**
 * @description Starts a local blockchain
 * @param projectRootDir Root of the project
 * @returns Process in which local blockchain runs
 */
export const startLocalBlockchain = async (projectRootDir) => {
    const process = shell.exec("npx hardhat node", {
        async: true,
        cwd: `${projectRootDir}/smart-contracts`
    });
    process.on("spawn", () => {
        logSuccessWithBg("Local test blockchain starting; HTTP-JSON-RPC: http://127.0.0.1:8545");
    });
    process.on("close", () => {
        logErrorWithBg("Local test blockchain stopped");
    });
    await waitFor(2);
    return process;
}

/**
 * @description Runs the deploy script to deploy all smart contracts on local chain
 * @param projectRootDir Project root directory
 * @returns Map of deployed smart contract names to their details
 */
export const deploySmartContractsLocalChain = async (projectRootDir, startBlockNumber = 1) => {
    // Deploy
    logSuccessWithBg(`${startBlockNumber === 1 ? "Deploying" : "Redeploying"} smart contracts on local chain`);

    shell.exec("npx hardhat run --network localhost scripts/deploy_localhost.ts", {
        cwd: `${projectRootDir}/smart-contracts`
    });

    const { contractsDeployedMap, blockNumberCurr } = await getDeployedSmartContractsLocalChain(projectRootDir, startBlockNumber);

    // Log data
    Object
        .entries(contractsDeployedMap)
        .forEach(([contractName, data]) => {
            logInfoWithBg(`Contract deployed: ${contractName} -> ${data.contractAddress}`)
        });

    return { contractsDeployedMap, blockNumberCurr };
}

/**
 * @description Gets smart contracts data deployed on local chain
 * @param projectRootDir Root directory of the project
 * @param startBlockNumber Block number to start enumerating from
 * @returns `contractsDeployedLatest` - Map of contract name to contract details (latest only)
 */
export const getDeployedSmartContractsLocalChain = async (projectRootDir, startBlockNumber = 1) => {
    // Get current block number
    const blockNumberCurr = await providerLocalBlockchain.send("eth_blockNumber", []);
    const blockNumberCurrInt = parseInt(blockNumberCurr);

    // For each block number after last procesed block number, get block transactions, and filter by which ones are Contract deployment transactions
    const blockTransactionsContractDeployments = [];
    const transactionsQueryPromises = [];
    for (let blockNumberToQuery = startBlockNumber; blockNumberToQuery <= blockNumberCurrInt; blockNumberToQuery++) {
        transactionsQueryPromises.push(
            (async () => {
                const blockTransactions = (await providerLocalBlockchain.send("eth_getBlockByNumber", [`0x${blockNumberToQuery.toString(16)}`, true]))?.transactions ?? [];
                blockTransactionsContractDeployments.push(
                    ...(blockTransactions.filter((tx) => tx.to === null))
                );
            })()
        );
    }
    await Promise.all(transactionsQueryPromises);

    // For all above found transactions, get their receipts
    const blockTransactionReceipts = await Promise.all(
        blockTransactionsContractDeployments.map((tx) => (
            providerLocalBlockchain.send("eth_getTransactionReceipt", [tx.hash])
        ))
    );

    // For all found transactions, get their Contract address, bytecode and name
    const contractsDeployedMap = {};
    const artifactFilesPath = shell
        .ls("-R", [`${projectRootDir}/smart-contracts/artifacts/contracts/**/*.json`])
        .filter((path) => !path.endsWith(".dbg.json"));
    const artifacts = artifactFilesPath.map((path) => JSON.parse(shell.cat(path)));

    for (let i = 0; i < blockTransactionReceipts.length; i++) {
        const artifact = artifacts.find((artifact) => artifact.bytecode === blockTransactionsContractDeployments[i].input);

        contractsDeployedMap[artifact.contractName.toUpperCase()] = {
            contractAddress: blockTransactionReceipts[i].contractAddress,
            bytecode: artifact.bytecode,
            abi: artifact.abi
        }
    }

    // Return data
    return {
        contractsDeployedMap,
        blockNumberCurr: blockNumberCurrInt
    };
}
