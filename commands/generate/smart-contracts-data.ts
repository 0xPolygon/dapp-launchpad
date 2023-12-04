import { IGenerateSmartContractsConfig } from "../../types/commands";
import { IContractDeploymentMap } from "../../types/constants";
import { writeSmartContractsDataToFrontend } from "../../utils/file";
import { askUserInput } from "../../utils/input";
import { logErrorWithBg, logSuccessWithBg, logWarningWithBg } from "../../utils/print";
import { getCWD, isCWDProjectRootDirectory } from "../../utils/project";
import path from "path";
import { getSupportedNetworkNames } from "../../utils/smart-contracts";
import { getDAppScaffoldConfig } from "../../utils/config";

/**
 * @description Generates smart contracts data
 */
export const generateSmartContractsConfig = async ({ environment, networkName }: IGenerateSmartContractsConfig) => {
    try {
        //// 0. Do checks
        // Check if it's project directory
        if (!isCWDProjectRootDirectory()) {
            logErrorWithBg("You're not in your dApp Launchpad project root directory!");
            return;
        }
        const projectRootDir = getCWD();

        // Check if forking network is correct
        const supportedNetworks = getSupportedNetworkNames();
        if (!(networkName && supportedNetworks.includes(networkName))) {
            logErrorWithBg(`Network unsupported! Supported networks are: ${supportedNetworks.join(", ")}`);
            return;
        }

        //// 1. Get data from user
        let shouldContinue = true;
        const data: IContractDeploymentMap = {};
        while (shouldContinue) {
            // Take one contract details
            const name = await askUserInput("\nEnter contract name (mandatory): ") as string;
            const address = await askUserInput("Enter contract address (mandatory): ") as string;
            const bytecode = await askUserInput("Enter contract bytecode (optional): ") as string;
            const abi = await askUserInput("Enter contract abi (optional): ") as string;

            // Validate input
            if (!name) {
                logWarningWithBg("Invalid name. Please enter the correct contract name.");
                continue;
            } else if (!address) {
                logWarningWithBg("Invalid address. Please enter the correct contract address.");
                continue;
            }

            // Store in object
            data[name.toUpperCase()] = ({
                name,
                contractAddress: address,
                bytecode,
                abi
            });

            // Ask if one more is to be added
            shouldContinue = (await askUserInput("Add one more (Y/n)?: ") as string).toLowerCase() === "n" ? false : true;
        }

        //// 2. Write data to frontend
        writeSmartContractsDataToFrontend(projectRootDir, environment, data, networkName);
        logSuccessWithBg(`Smart configs generated in "${path.resolve(projectRootDir, getDAppScaffoldConfig(projectRootDir).template.filesAndDirs.frontend["smart-contracts-config-dir"])}".`);
        logWarningWithBg("This does not generate typescript typings.");
    } catch (e) {
        console.error(e);
    }
}
