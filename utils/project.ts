import shell from "shelljs";
import path from "path";
import { IEnvironment } from "../types/constants";
import { getDAppScaffoldConfig } from "./config";

/**
 * @description Gets Polygon DApp Scaffold project's root directory
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

    const smartContractsDirExists = shell.test("-d", path.resolve(cwd, getDAppScaffoldConfig(cwd).template.filesAndDirs["smart-contracts"]["path-dir"]));
    const frontendDirExists = shell.test("-d", path.resolve(cwd, getDAppScaffoldConfig(cwd).template.filesAndDirs.frontend["path-dir"]));
    const configExists = shell.test("-f", path.resolve(cwd, "dapp-scaffold.config.json"));

    return (smartContractsDirExists && frontendDirExists && configExists);
}

/**
 * @description Checks to see if smart contracts configs exist in frontend
 * @param projectRootDir Project root directory
 * @param env Environment of config
 * @returns Check result
 */
export const isSmartContractsConfigExist = (projectRootDir: string, env: IEnvironment) => {
    return (
        shell.test("-f", path.resolve(projectRootDir, getDAppScaffoldConfig(projectRootDir).template.filesAndDirs.frontend[`smart-contracts-${env}`])) &&
        shell.test("-f", path.resolve(projectRootDir, getDAppScaffoldConfig(projectRootDir).template.filesAndDirs.frontend[`deployed-network-${env}`]))
    );
}
