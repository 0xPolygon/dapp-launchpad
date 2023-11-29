import shelljs from "shelljs";
import { logErrorWithBg, logInfoWithBg, logSuccessWithBg } from "../utils/print";
import { getCWD } from "../utils/project";
import path from "path";
import { IInitCommandOptions } from "../types/commands";
import { fixDAppScaffoldConfig, getAvailableScaffoldTemplates, getDAppScaffoldConfig } from "../utils/config";


export const init = (projectName: string, { template }: IInitCommandOptions) => {
    // Check if GIT exists
    if (!shelljs.which("git")) {
        logErrorWithBg("To initialize the project, you will need to have Git installed. For instructions on how to do this, please refer to the following link: https://github.com/git-guides/install-git.");
        return;
    }

    // Check if valid template
    const availableTemplates = getAvailableScaffoldTemplates();
    if (!availableTemplates.includes(template)) {
        logErrorWithBg(`Not a valid scaffold template. Available: ${availableTemplates.join(", ")}`);
        return;
    }

    const cwd = getCWD();
    const projectRootDirName = projectName ?? `my-project-${Math.floor(Math.random() * 10000).toString(16)}`;
    const projectRootDir = path.resolve(cwd, projectRootDirName);
    const smartContractsDir = path.resolve(projectRootDir, getDAppScaffoldConfig(projectRootDir).template.filesAndDirs["smart-contracts"]["path-dir"]);
    const frontendDir = path.resolve(projectRootDir, getDAppScaffoldConfig(projectRootDir).template.filesAndDirs.frontend["path-dir"]);

    // Clone scaffold directory
    logInfoWithBg("Cloning scaffolded project repo")
    shelljs.exec(
        `git clone --branch scaffold-template/${template} https://github.com/0xpolygon/polygon-dapp-scaffold ${projectRootDirName}`,
        { cwd }
    );

    // Remove repo
    shelljs.rm("-rf", [path.resolve(projectRootDir, ".git")]);

    // Install deps in Smart contracts
    const packageManagerCommand = shelljs.which("yarn") ? "yarn" : "npm install";
    logInfoWithBg("Installing smart contract dependencies");
    shelljs.exec(
        packageManagerCommand,
        { cwd: smartContractsDir }
    );

    // Install deps in Frontend
    logInfoWithBg("Installing frontend dependencies");
    shelljs.exec(
        packageManagerCommand,
        { cwd: frontendDir }
    );

    // Fix Dapp scaffold config
    fixDAppScaffoldConfig(projectRootDir);

    // Initialise new repo
    shelljs.exec(
        `git init; git add .; git commit -m "First commit";`,
        { cwd: projectRootDir }
    );

    logSuccessWithBg(`Project scaffolded! For help, go to '${projectRootDirName}' and type 'create-polygon-dapp help'.`);
}
