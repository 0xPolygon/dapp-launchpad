import shelljs from "shelljs";
import { logErrorWithBg, logInfoWithBg, logSuccessWithBg } from "../utils/print";
import { getCWD } from "../utils/project";
import path from "path";

export const init = (projectName: string) => {
    // Check if GIT exists
    if (!shelljs.which("git")) {
        logErrorWithBg("You need GIT to initialise the project. To know how, please refer https://github.com/git-guides/install-git.");
        return;
    }

    const cwd = getCWD();
    const projectRootDirName = projectName ?? `my-project-${Math.floor(Math.random() * 10000).toString(16)}`;
    const projectRootDir = path.resolve(cwd, projectRootDirName);
    const smartContractsDir = path.resolve(projectRootDir, "smart-contracts");
    const frontendDir = path.resolve(projectRootDir, "frontend");

    // Clone scaffold directory
    logInfoWithBg("Cloning scaffolded project repo")
    shelljs.exec(
        `git clone --branch scaffolded-project https://github.com/captain-woof/poly-scaffold ${projectRootDirName}`,
        { cwd }
    );

    // Remove repo
    shelljs.rm("-rf", [path.resolve(projectRootDir, ".git")]);

    // Install deps in Smart contracts
    logInfoWithBg("Installing smart contract dependencies");
    shelljs.exec(
        "yarn",
        { cwd: smartContractsDir }
    );

    // Install deps in Frontend
    logInfoWithBg("Installing frontend dependencies");
    shelljs.exec(
        "yarn",
        { cwd: frontendDir }
    );

    // Initialise new repo
    shelljs.exec(
        `git init; git add .; git commit -m "First commit";`,
        { cwd: projectRootDir }
    );

    logSuccessWithBg(`Project scaffolded! For help, go to '${projectRootDirName}' and type 'poly-scaffold help'.`);
}