import shell from "shelljs";
import path from "path";
import { IEnvironment } from "../types/constants";
import { getDAppLaunchpadConfig } from "./config";

/**
 * @description Gets dApp Launchpad project's root directory
 * @return Project root
 */
export const getCWD = () => {
    return process.cwd();
}

/**
 * @description Checks if current directory is the project root directory
 * @returns True, if it is
 */
export const isCWDProjectRootDirectory = () => {
    const cwd = process.cwd();

    const configExists = shell.test("-f", path.resolve(cwd, "dapp-launchpad.config.json"));
    if(!configExists) return false;

    const smartContractsDirExists = shell.test("-d", path.resolve(cwd, getDAppLaunchpadConfig(cwd).template.filesAndDirs["smart-contracts"]["path-dir"]));
    const frontendDirExists = shell.test("-d", path.resolve(cwd, getDAppLaunchpadConfig(cwd).template.filesAndDirs.frontend["path-dir"]));

    return (smartContractsDirExists && frontendDirExists);
}

/**
 * @description Checks to see if smart contracts configs exist in frontend
 * @param projectRootDir Project root directory
 * @param env Environment of config
 * @returns Check result
 */
export const isSmartContractsConfigExist = (projectRootDir: string, env: IEnvironment) => {
    return (
        shell.test("-f", path.resolve(projectRootDir, getDAppLaunchpadConfig(projectRootDir).template.filesAndDirs.frontend[`smart-contracts-${env}`])) &&
        shell.test("-f", path.resolve(projectRootDir, getDAppLaunchpadConfig(projectRootDir).template.filesAndDirs.frontend[`deployed-network-${env}`]))
    );
}
