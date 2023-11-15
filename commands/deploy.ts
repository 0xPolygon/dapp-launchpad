import { writeSmartContractsDataToFrontend } from "../utils/file";
import { deployFrontendToProduction } from "../utils/frontend";
import { logErrorWithBg, logSuccessWithBg } from "../utils/print";
import { getCWD, isCWDProjectRootDirectory } from "../utils/project";
import { deploySmartContractsProduction, getSupportedNetworkNames } from "../utils/smart-contracts";

/**
 * @description Deploys everything to production
 */
export const deploy = async ({ networkName, onlySmartContracts, onlyFrontend }: { networkName: string, onlySmartContracts?: boolean, onlyFrontend?: boolean }) => {
    try {
        //// 0. Do checks
        // Check if it's project directory
        if (!isCWDProjectRootDirectory()) {
            logErrorWithBg("You're not in your Poly-Scaffold project root directory!");
            return;
        }
        const projectRootDir = getCWD();

        // Check if deploy network is correct
        const supportedNetworks = getSupportedNetworkNames();
        if (!supportedNetworks.includes(networkName)) {
            logErrorWithBg(`Network unsupported! Supported networks are: ${supportedNetworks.join(", ")}`);
            return;
        }

        // Runs by default + in "only smart contracts mode"        
        if (!onlyFrontend) {
            //// 1. Run deploy script and log results
            const { contractsDeployedMap } = await deploySmartContractsProduction(projectRootDir, networkName);

            //// 2. Write results for frontend
            writeSmartContractsDataToFrontend(projectRootDir, "production", contractsDeployedMap, networkName);
        }

        // Runs by default + in "only frontend mode"
        if (!onlySmartContracts) {
            //// 3. Deploy Frontend
            await deployFrontendToProduction(projectRootDir);
        }

        // All done
        logSuccessWithBg("Your Polygon project is deployed :)")
    } catch (e) {
        logErrorWithBg("Could not deploy project");
        console.error(e);
    }
}