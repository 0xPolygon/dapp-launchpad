import shell from "shelljs";
import path from "path";
import networksMap from "../config/networks.json";
import { IEnvironment } from "../types/constants";
import { getDAppLaunchpadConfig } from "./config";

/**
 * @description Copies typechain types to frontend
 * @param {string} projectRootDir 
 */
export const writeTypechainTypesToFrontend = (projectRootDir: string) => {
    const frontendTypesDir = getDAppLaunchpadConfig(projectRootDir).template.filesAndDirs.frontend["types-dir"];
    const frontendTypechainDir = getDAppLaunchpadConfig(projectRootDir).template.filesAndDirs.frontend["typechain-types-dir"];
    const smartContractsTypechainDir = getDAppLaunchpadConfig(projectRootDir).template.filesAndDirs["smart-contracts"]["typechain-types-dir"];

    if (!(frontendTypesDir && frontendTypechainDir && smartContractsTypechainDir)) return;

    const frontendTypechainDirFull = path.resolve(projectRootDir, frontendTypechainDir);
    if (shell.test("-d", frontendTypechainDirFull)) {
        shell.rm("-r", frontendTypechainDirFull);
    }

    const frontendTypesDirFull = path.resolve(projectRootDir, frontendTypesDir);
    if (!shell.test("-d", frontendTypesDirFull)) {
        shell.mkdir("-p", frontendTypesDirFull);
    }

    shell.cp("-r",
        path.resolve(projectRootDir, smartContractsTypechainDir),
        frontendTypesDirFull
    );
}

/**
 * @description Writes smart contracts data to frontend
 * @param projectRootDir Project root directory
 * @param env Environment
 * @param smartContractsData Smart contract data to write
 * @param networkName Network name where contracts are deployed
 */
export const writeSmartContractsDataToFrontend = (projectRootDir: string, env: IEnvironment = "development", smartContractsData: any, networkName: any) => {
    const constantsDir = path.resolve(projectRootDir, getDAppLaunchpadConfig(projectRootDir).template.filesAndDirs.frontend["smart-contracts-config-dir"]);
    if (!shell.test("-d", constantsDir)) {
        shell.mkdir("-p", constantsDir);
    }

    new shell.ShellString(JSON.stringify(smartContractsData))
        .to(path.resolve(projectRootDir, getDAppLaunchpadConfig(projectRootDir).template.filesAndDirs.frontend[`smart-contracts-${env}`]));

    new shell.ShellString(JSON.stringify((networksMap as any)[networkName]))
        .to(path.resolve(projectRootDir, getDAppLaunchpadConfig(projectRootDir).template.filesAndDirs.frontend[`deployed-network-${env}`]));
}
