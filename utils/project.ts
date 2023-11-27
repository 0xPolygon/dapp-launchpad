import shell from "shelljs";
import path from "path";
import { IEnvironment } from "../types/constants";

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
    const smartContractsDirExists = shell.test("-d", path.resolve(process.cwd(), "smart-contracts"));
    const frontendDirExists = shell.test("-d", path.resolve(process.cwd(), "frontend"));

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
        shell.test("-f", path.resolve(projectRootDir, "frontend", "src", "constants", `smart-contracts-${env}.json`)) &&
        shell.test("-f", path.resolve(projectRootDir, "frontend", "src", "constants", `deployed-network-${env}.json`))
    );
}
