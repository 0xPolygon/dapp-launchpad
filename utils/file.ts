import shell from "shelljs";
import path from "path";

/**
 * @description Copies typechain types to frontend
 * @param {string} projectRootDir 
 */
export const writeTypechainTypesToFrontend = (projectRootDir: string) => {
    const typechainDir = path.resolve(projectRootDir, "frontend", "src", "types", "typechain-types");
    if (shell.test("-d", typechainDir)) {
        shell.rm("-r", typechainDir);
    }

    const typeDir = path.resolve(projectRootDir, "frontend", "src", "types");
    if (!shell.test("-d", typeDir)) {
        shell.mkdir("-p", typeDir);
    }

    shell.cp("-r",
        path.resolve(projectRootDir, "smart-contracts", "typechain-types"),
        typeDir
    );
}

/**
 * @description Writes smart contracts data to frontend
 * @param projectRootDir Project root directory
 * @param env Environment
 * @param data Data to write
 */
export const writeSmartContractsDataToFrontend = (projectRootDir: string, env: "development" | "production" = "development", data: any) => {
    const constantsDir = path.resolve(projectRootDir, "frontend", "src", "constants");
    if (!shell.test("-d", constantsDir)) {
        shell.mkdir("-p", constantsDir);
    }

    new shell.ShellString(JSON.stringify(data))
        .to(path.resolve(projectRootDir, "frontend", "src", "constants", "smart-contracts.json"));
}
