import { getCWD, isCWDProjectRootDirectory } from "../utils/project.js";
import { logErrorWithBg } from "../utils/print.js";
import chokidar from "chokidar";
import { startLocalBlockchain, deploySmartContractsLocalChain, getSupportedNetworkNames, getLatestBlockNumberOfNetwork } from "../utils/smart-contracts.js";
import { writeSmartContractsDataToFrontend, writeTypechainTypesToFrontend } from "../utils/file.js";
import { startLocalFrontendDevServer } from "../utils/frontend.js";
import shelljs from "shelljs";

/**
 * @description Command that runs on Dev
 */
export const dev = async ({ forkNetwork, forkBlockNumber }: { forkNetwork?: string; forkBlockNumber?: string }) => {
    // Data
    let projectRootDir: string;
    let localBlockchainProcess: ReturnType<typeof shelljs.exec>;
    let localFrontendDevServerProcess;
    let watcher;
    let interval;
    let startBlockNumber = 1;
    let contractsDeployedMap = {};
    let firstTimeDeploying = true;

    // Functions
    const _prepareSmartContracts = async () => {
        // Deploy contracts
        const { contractsDeployedMap: contractsDeployedMapNew, blockNumberCurr } = await deploySmartContractsLocalChain(projectRootDir, startBlockNumber, firstTimeDeploying);
        startBlockNumber = blockNumberCurr + 1;
        firstTimeDeploying = false;
        contractsDeployedMap = { ...contractsDeployedMap, ...contractsDeployedMapNew };

        // Copy new typechain types to frontend app
        writeTypechainTypesToFrontend(projectRootDir);

        // Patch in new contract data in frontend app
        writeSmartContractsDataToFrontend(projectRootDir, "development", contractsDeployedMap);
    }

    try {
        //// 0. Do checks
        // Check if it's project directory
        if (!isCWDProjectRootDirectory()) {
            logErrorWithBg("You're not in your Poly-Scaffold project root directory!");
            return;
        }
        projectRootDir = getCWD();

        // Check if forking network is correct
        const supportedNetworks = getSupportedNetworkNames();
        if (forkNetwork) {
            if (!supportedNetworks.includes(forkNetwork)) {
                logErrorWithBg(`Network unsupported! Supported networks are: ${supportedNetworks.join(", ")}`);
                return;
            } else {
                if (forkBlockNumber) {
                    startBlockNumber = parseInt(forkBlockNumber);
                } else {
                    startBlockNumber = await getLatestBlockNumberOfNetwork(forkNetwork) - 500;
                }
            }
        }

        //// 1. Start local blockchain
        localBlockchainProcess = await startLocalBlockchain(projectRootDir, { forkNetwork, forkBlockNumber: startBlockNumber });

        //// 2. Deploy smart contracts for the first time
        await _prepareSmartContracts();

        //// 3. Start watcher for local blockchain directory
        watcher = chokidar.watch([
            `${projectRootDir}/smart-contracts/contracts`,
            `${projectRootDir}/smart-contracts/scripts/deploy_localhost.ts`,
        ], {
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 500
            },
        });
        watcher.on("change", _prepareSmartContracts);

        //// 4 Start local frontend dev server
        localFrontendDevServerProcess = startLocalFrontendDevServer(projectRootDir);

        //// Keep running forever
        interval = setInterval(() => { }, 1 << 30);
    } catch (e) {
        console.error(e);
        clearInterval(interval);
        localBlockchainProcess!.kill("SIGINT");
        localFrontendDevServerProcess!.kill("SIGINT");
        await watcher?.close();
    }
}
