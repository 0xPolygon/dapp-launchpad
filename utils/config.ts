import fetch from "node-fetch";
import path from "path";
import shell, { ShellString } from "shelljs";
import { IDappScaffoldConfig } from "../types/constants";

/**
 * @description Gets list of available scaffold templates
 * @returns List of templates
 */
export const getAvailableScaffoldTemplates = () => {
    //const resp = await fetch("https://api.github.com/repos/0xPolygon/dapp-launchpad/branches") --> REPLACE IN FUTURE WHEN OPEN-SOURCED

    return [
        "javascript",
        "typescript"
    ]
}

/**
 * @description Gets DApp Scaffold config
 * @param projectRootDir Project root directory
 * @returns Config
 */
export const getDAppLaunchpadConfig = (projectRootDir: string) => {
    const configPath = path.resolve(projectRootDir, "dapp-launchpad.config.json");
    const configToReturn: IDappScaffoldConfig = JSON.parse(shell.cat(configPath));
    return configToReturn;
}

/**
 * @description Fixes DApp Scaffold config if needed
 * @param projectRootDir Project root directory
 */
export const fixDAppScaffoldConfig = (projectRootDir: string) => {
    const configPath = path.resolve(projectRootDir, "dapp-launchpad.config.json");
    const config: IDappScaffoldConfig = JSON.parse(shell.cat(configPath));

    // Fix pathnames
    if (path.sep !== "/") {
        Object
            .keys(config.template.filesAndDirs)
            .forEach((masterDirType) => {
                Object
                    .entries((config.template.filesAndDirs as any)[masterDirType])
                    .forEach(([subDirType, pathRelative]) => {
                        (config.template.filesAndDirs as any)[masterDirType][subDirType] = path.join(...(pathRelative as string).split("/"));
                    });
            });

        new ShellString(JSON.stringify(config)).to(configPath);
    }
}
