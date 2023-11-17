import { getCWD, isCWDProjectRootDirectory } from "../utils/project";
import { logErrorWithBg } from "../utils/print";
import chokidar from "chokidar";
import { startLocalBlockchain, deploySmartContractsLocalChain, getSupportedNetworkNames, getLatestBlockNumberOfNetwork, waitForLocalBlockchainToStart, resetLocalBlockchain } from "../utils/smart-contracts";
import { writeSmartContractsDataToFrontend, writeTypechainTypesToFrontend } from "../utils/file";
import { startLocalFrontendDevServer, waitForLocalFrontendDevServerToStart } from "../utils/frontend";
import shelljs from "shelljs";
import path from "path";

/**
 * @description Command that runs on Dev
 */
export const dev = async ({ forkNetworkName, forkBlockNum, resetOnChange }: { forkNetworkName?: string; forkBlockNum?: string, resetOnChange?: boolean }) => {
    // Data
    let projectRootDir: string;
    let localBlockchainProcess: ReturnType<typeof shelljs.exec>;
    let localFrontendDevServerProcess;
    let watcher;
    let interval;
    let startBlockNumber = 1;
    let blockNumberLastIndexed = 1;
    let contractsDeployedMap = {};
    let firstTimeDeploying = true;

    // Functions
    const _prepareSmartContracts = async () => {
        // Reset chain if needed
        if(!firstTimeDeploying && resetOnChange) {
            await resetLocalBlockchain({
                startBlockNumber: startBlockNumber,
                networkName: forkNetworkName
            });
            blockNumberLastIndexed = startBlockNumber;
        }

        // Deploy contracts
        const { contractsDeployedMap: contractsDeployedMapNew, blockNumberCurr } = await deploySmartContractsLocalChain(projectRootDir, blockNumberLastIndexed, firstTimeDeploying);
        blockNumberLastIndexed = blockNumberCurr + 1;
        firstTimeDeploying = false;
        contractsDeployedMap = { ...contractsDeployedMap, ...contractsDeployedMapNew };

        // Copy new typechain types to frontend app
        writeTypechainTypesToFrontend(projectRootDir);

        // Patch in new contract data in frontend app
        writeSmartContractsDataToFrontend(projectRootDir, "development", contractsDeployedMap, forkNetworkName ?? "localhost");
    }

    try {
        //// 0. Do checks
        // Check if it's project directory
        if (!isCWDProjectRootDirectory()) {
            logErrorWithBg("You're not in your Polygon DApp Scaffold project root directory!");
            return;
        }
        projectRootDir = getCWD();

        // Check if forking network is correct
        const supportedNetworks = getSupportedNetworkNames();
        if (forkNetworkName) {
            if (!supportedNetworks.includes(forkNetworkName)) {
                logErrorWithBg(`Network unsupported! Supported networks are: ${supportedNetworks.join(", ")}`);
                return;
            } else {
                if (forkBlockNum) {
                    blockNumberLastIndexed = parseInt(forkBlockNum);
                }
                else {
                    blockNumberLastIndexed = await getLatestBlockNumberOfNetwork(forkNetworkName);
                }
                startBlockNumber = blockNumberLastIndexed;
            }
        }

        //// 1. Start local blockchain and wait for it to start
        localBlockchainProcess = await startLocalBlockchain(projectRootDir, { forkNetworkName, forkBlockNumber: blockNumberLastIndexed });
        await waitForLocalBlockchainToStart(blockNumberLastIndexed);

        //// 2. Deploy smart contracts for the first time
        await _prepareSmartContracts();

        //// 3. Start watcher for local blockchain directory
        watcher = chokidar.watch([
            path.resolve(projectRootDir, "smart-contracts", "contracts"),
            path.resolve(projectRootDir, "smart-contracts", "scripts", "deploy_localhost.ts"),
        ], {
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 500
            },
        });
        watcher.on("change", _prepareSmartContracts);

        //// 4 Start local frontend dev server and wait for it to start
        localFrontendDevServerProcess = startLocalFrontendDevServer(projectRootDir);
        await waitForLocalFrontendDevServerToStart();

        //// Keep running forever
        interval = setInterval(() => { }, 1 << 30);
    } catch (e) {
        console.error(e);
        clearInterval(interval);
        localBlockchainProcess!?.kill("SIGINT");
        localFrontendDevServerProcess!?.kill("SIGINT");
        await watcher?.close();
    }
}
