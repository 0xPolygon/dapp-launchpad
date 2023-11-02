import { getCWD, isCWDProjectRootDirectory } from "../utils/project.js";
import { logError } from "../utils/print.js";
import chokidar from "chokidar";
import { startLocalBlockchain, deploySmartContractsLocalChain } from "../utils/smart-contracts.js";
import { writeSmartContractsDataToFrontend, writeTypechainTypesToFrontend } from "../utils/file.js";
import { startLocalFrontendDevServer } from "../utils/frontend.js";

/**
 * @description Command that runs on Dev
 */
export const dev = async () => {
    // Dats
    let projectRootDir;
    let localBlockchainProcess;
    let localFrontendDevServerProcess;
    let watcher;
    let interval;
    let startBlockNumber = 1;
    let contractsDeployedMap = {};

    // Functions
    const _prepareSmartContracts = async () => {
        // Deploy contracts
        const { contractsDeployedMap: contractsDeployedMapNew, blockNumberCurr } = await deploySmartContractsLocalChain(projectRootDir, startBlockNumber);
        startBlockNumber = blockNumberCurr + 1;
        contractsDeployedMap = { ...contractsDeployedMap, ...contractsDeployedMapNew };

        // Copy new typechain types to frontend app
        writeTypechainTypesToFrontend(projectRootDir);

        // Patch in new contract data in frontend app
        writeSmartContractsDataToFrontend(projectRootDir, "development", contractsDeployedMap);
    }

    try {
        // 0. Do checks
        if (!isCWDProjectRootDirectory()) {
            logError("You're not in your Poly-Scaffold project root directory!");
            return;
        }
        projectRootDir = getCWD();

        // 1. Start local blockchain
        localBlockchainProcess = await startLocalBlockchain(projectRootDir);

        // 2. Deploy smart contracts for the first time
        await _prepareSmartContracts();

        // 3. Start watcher for local blockchain directory
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

        // 4 Start local frontend dev server
        localFrontendDevServerProcess = startLocalFrontendDevServer(projectRootDir);

        // Keep running forever
        interval = setInterval(() => { }, 1 << 30);
    } catch (e) {
        console.error(e);
        clearInterval(interval);
        localBlockchainProcess.kill("SIGINT");
        localFrontendDevServerProcess.kill("SIGINT");
        await watcher.close();
    }
}
