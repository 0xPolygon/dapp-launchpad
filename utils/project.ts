import shell from "shelljs";

/**
 * @description Gets Poly-Scaffold project's root directory
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
    const smartContractsDirExists = shell.test("-d", `${process.cwd()}/smart-contracts`);
    const frontendDirExists = shell.test("-d", `${process.cwd()}/frontend`);

    return (smartContractsDirExists && frontendDirExists);
}
