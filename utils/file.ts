import shell from "shelljs";

/**
 * @description Copies typechain types to frontend
 * @param {string} projectRootDir 
 */
export const writeTypechainTypesToFrontend = (projectRootDir: string) => {
    if (shell.test("-d", `${projectRootDir}/frontend/src/types/typechain-types`)) {
        shell.rm("-r", `${projectRootDir}/frontend/src/types/typechain-types`);
    }

    if(!shell.test("-d", `${projectRootDir}/frontend/src/types`)) {
        shell.mkdir("-p", `${projectRootDir}/frontend/src/types`);
    }

    shell.cp("-r", `${projectRootDir}/smart-contracts/typechain-types`, `${projectRootDir}/frontend/src/types`);
}

/**
 * @description Writes smart contracts data to frontend
 * @param projectRootDir Project root directory
 * @param env Environment
 * @param data Data to write
 */
export const writeSmartContractsDataToFrontend = (projectRootDir: string, env: "development" | "production" = "development", data: any) => {
    if(!shell.test("-d", `${projectRootDir}/frontend/src/constants`)) {
        shell.mkdir("-p", `${projectRootDir}/frontend/src/constants`);
    }

    new shell.ShellString(JSON.stringify(data))
        .to(`${projectRootDir}/frontend/src/constants/smart-contracts.json`);
}
