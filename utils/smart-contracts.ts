import shell from "shelljs";
import { logErrorWithBg, logSuccessWithBg, logInfoWithBg } from "./print";
import { ethers } from "ethers";
import { waitFor } from "./time";
import networksMap from "../config/networks.json";
import path from "path";

// CONSTANTS
const providerLocalBlockchain = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

/**
 * @description Starts a local blockchain
 * @param projectRootDir Root of the project
 * @param additionalOptions Additional options to start local chain
 * @returns Process in which local blockchain runs
 */
export const startLocalBlockchain = async (
    projectRootDir: string,
    { forkBlockNumber, forkNetworkName }: {
        forkNetworkName?: string,
        forkBlockNumber?: string | number
    } = {}
) => {
    // Fork params
    const forkNetworkConfig = getSupportedNetworkConfig(forkNetworkName);

    const forkNetworkParam = forkNetworkConfig
        ? `--fork ${forkNetworkConfig.forking.url} `
        : "";
    const forkBlockNumberParam = forkNetworkConfig && forkBlockNumber
        ? `--fork-block-number ${forkBlockNumber}`
        : "";

    // Start process
    const process = shell.exec(`npx hardhat node ${forkNetworkParam} ${forkBlockNumberParam}`, {
        async: true,
        cwd: path.resolve(projectRootDir, "smart-contracts")
    });
    process.on("spawn", () => {
        logInfoWithBg("Starting local test blockchain");
    });
    process.on("close", () => {
        logErrorWithBg("Local test blockchain stopped");
    });

    // Return process
    return process;
}

/**
 * @description Waits for local blockchain to start
 */
export const waitForLocalBlockchainToStart = async (forkBlockNumber: number) => {
    while (true) {
        try {
            await fetch("http://127.0.0.1:8545");
            logSuccessWithBg(
                forkBlockNumber === 1
                    ? "Started test blockchain (ID:31337); HTTP-JSON-RPC: http://127.0.0.1:8545"
                    : `Started test blockchain (ID:31337); forked at block#${forkBlockNumber}; HTTP-JSON-RPC: http://127.0.0.1:8545`
            );
            break;
        } catch (e: any) {
            if (e.cause.toString().includes("ECONNREFUSED")) { // If RPC has not started yet
                await waitFor(2);
            } else {
                logErrorWithBg("Failed to start local test blockchain; ", e.cause);
                throw e;
            }
        }
    }
}

/**
 * @description Runs the deploy script to deploy all smart contracts on local chain
 * @param projectRootDir Project root directory
 * @param firstTimeDeploying True, if it's the first time this function is called
 * @returns Map of deployed smart contract names to their details
 */
export const deploySmartContractsLocalChain = async (projectRootDir: string, startBlockNumber = 1, firstTimeDeploying: boolean) => {
    // Deploy
    logInfoWithBg(`${firstTimeDeploying ? "Deploying" : "Redeploying"} smart contracts on local chain`);

    shell.exec(`npx hardhat run --network localhost scripts${path.sep}deploy_localhost.ts`, {
        cwd: path.resolve(projectRootDir, "smart-contracts"),
        silent: true
    });

    const { contractsDeployedMap, blockNumberCurr } = await getDeployedSmartContractsLocalChain(projectRootDir, startBlockNumber);

    // Log data
    Object
        .entries(contractsDeployedMap)
        .forEach(([contractName, data]) => {
            logSuccessWithBg(`Contract deployed: ${contractName} -> ${data.contractAddress}`)
        });

    return { contractsDeployedMap, blockNumberCurr };
}

/**
 * @description Gets smart contracts data deployed on local chain
 * @param projectRootDir Root directory of the project
 * @param startBlockNumber Block number to start enumerating from
 * @returns `contractsDeployedLatest` - Map of contract name to contract details (latest only)
 */
export const getDeployedSmartContractsLocalChain = async (projectRootDir: string, startBlockNumber = 1) => {
    // Get current block number
    const blockNumberCurr = await providerLocalBlockchain.send("eth_blockNumber", []);
    const blockNumberCurrInt = parseInt(blockNumberCurr);

    // For each block number after last procesed block number, get block transactions, and filter by which ones are Contract deployment transactions
    const blockTransactionsContractDeployments: Array<{ to: string, input: string, hash: string }> = [];
    const transactionsQueryPromises = [];
    for (let blockNumberToQuery = startBlockNumber; blockNumberToQuery <= blockNumberCurrInt; blockNumberToQuery++) {
        transactionsQueryPromises.push(
            (async () => {
                const blockTransactions: Array<{ to: string, input: string, hash: string }> = (await providerLocalBlockchain.send("eth_getBlockByNumber", [`0x${blockNumberToQuery.toString(16)}`, true]))?.transactions ?? [];
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
    const contractsDeployedMap: { [contractName: string]: { contractAddress: string; bytecode: string; abi: any } } = {};
    const artifactFilesPath = shell
        .ls("-R", [path.resolve(projectRootDir, "smart-contracts", "artifacts", "contracts", `**${path.sep}*.json`)])
        .filter((path) => !path.endsWith(".dbg.json"));
    const artifacts = artifactFilesPath.map((path) => JSON.parse(shell.cat(path)));

    for (let i = 0; i < blockTransactionReceipts.length; i++) {
        const artifact = artifacts.find((artifact) => artifact.bytecode === blockTransactionsContractDeployments[i].input);

        if (!artifact) continue;

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

/**
 * @description Runs the deploy script to deploy all smart contracts for production
 * @param projectRootDir Project root directory
 * @param networkName Name of the chain on which to deploy contracts
 * @returns Map of deployed smart contract names to their details
 */
export const deploySmartContractsProduction = async (projectRootDir: string, networkName: string) => {
    // Deploy
    logInfoWithBg(`Deploying smart contracts on ${(networksMap as any)[networkName].name}`);

    const blockNumPreDeployment = await getLatestBlockNumberOfNetwork(networkName);
    const res = shell.exec(`npx hardhat run --network ${networkName} scripts${path.sep}deploy_prod.ts`, {
        cwd: path.resolve(projectRootDir, "smart-contracts"),
        silent: true
    });
    if (res.stderr) {
        throw Error(res.stderr);
    }
    const blockNumPostDeployment = await getLatestBlockNumberOfNetwork(networkName);

    const { contractsDeployedMap } = await getDeployedSmartContractsProduction(projectRootDir, networkName, blockNumPreDeployment, blockNumPostDeployment);

    // Log data
    Object
        .entries(contractsDeployedMap)
        .forEach(([contractName, data]) => {
            logSuccessWithBg(`Contract deployed: ${contractName} -> ${data.contractAddress}`)
        });

    return { contractsDeployedMap };
}

/**
 * @description Gets smart contracts data deployed on local chain
 * @param projectRootDir Root directory of the project
 * @param networkName Network from where to enumerate
 * @param blockNumStart Block number to start enumerating from
 * @param blockNumEnd Block number to end enumerating at
 * @returns `contractsDeployedLatest` - Map of contract name to contract details (latest only)
 */
export const getDeployedSmartContractsProduction = async (projectRootDir: string, networkName: string, blockNumStart: number, blockNumEnd: number) => {
    // For each block number, starting from `blockNumStart`, get block transactions, and filter by which ones are Contract deployment transactions
    const blockTransactionsContractDeployments: Array<{ to: string, input: string, hash: string }> = [];
    const transactionsQueryPromises = [];
    const providerProduction = new ethers.JsonRpcProvider((networksMap as any)[networkName].url);
    for (let blockNumberToQuery = blockNumStart; blockNumberToQuery <= blockNumEnd; blockNumberToQuery++) {
        transactionsQueryPromises.push(
            (async () => {
                const blockTransactions: Array<{ to: string, input: string, hash: string }> = (await providerProduction.send("eth_getBlockByNumber", [`0x${blockNumberToQuery.toString(16)}`, true]))?.transactions ?? [];
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
            providerProduction.send("eth_getTransactionReceipt", [tx.hash])
        ))
    );

    // For all found transactions, get their Contract address, bytecode and name
    const contractsDeployedMap: { [contractName: string]: { contractAddress: string; bytecode: string; abi: any } } = {};
    const artifactFilesPath = shell
        .ls("-R", [path.resolve(projectRootDir, "smart-contracts", "artifacts", "contracts", `**${path.sep}*.json`)])
        .filter((path) => !path.endsWith(".dbg.json"));
    const artifacts = artifactFilesPath.map((path) => JSON.parse(shell.cat(path)));

    for (let i = 0; i < blockTransactionReceipts.length; i++) {
        const artifact = artifacts.find((artifact) => artifact.bytecode === blockTransactionsContractDeployments[i].input);

        if (!artifact) continue;

        contractsDeployedMap[artifact.contractName.toUpperCase()] = {
            contractAddress: blockTransactionReceipts[i].contractAddress,
            bytecode: artifact.bytecode,
            abi: artifact.abi
        }
    }

    // Return data
    return {
        contractsDeployedMap,
    };
}

/**
 * @description Gets names of supported Network names in Hardhat
 * @returns Array of names
 */
export const getSupportedNetworkNames = () => {
    return Object
        .entries(networksMap)
        .filter(([_, config]) => (config as any).forking)
        .map(([networkName]) => networkName);
}

/**
 * @description Gets a supported network's config
 * @param {string} networkName Name of the network
 * @returns Config
 */
export const getSupportedNetworkConfig = (networkName?: string) => {
    return (networksMap as any)[networkName ?? ""];
}

/**
 * @description Gets a supported network's latest block number
 * @param {string} networkName Name of the network
 * @returns Latest block number
 */
export const getLatestBlockNumberOfNetwork = async (networkName: string) => {
    const rpcUrl = getSupportedNetworkConfig(networkName).url;
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const blockNumberCurr = await provider.send("eth_blockNumber", []);
    const blockNumberCurrInt = parseInt(blockNumberCurr);

    return blockNumberCurrInt;
}