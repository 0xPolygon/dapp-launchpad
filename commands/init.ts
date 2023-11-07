import shelljs from "shelljs";
import { logErrorWithBg, logInfoWithBg, logSuccessWithBg } from "../utils/print.js";
import { getCWD } from "../utils/project.js";

export const init = (projectName: string) => {
    // Check if GIT exists
    if (!shelljs.which("git")) {
        logErrorWithBg("You need GIT to initialise the project. To know how, please refer https://github.com/git-guides/install-git.");
        return;
    }

    const cwd = getCWD();
    const projectRootDir = projectName ?? `my-project-${Math.floor(Math.random() * 10000).toString(16)}`

    // Clone scaffold directory
    logInfoWithBg("Cloning scaffolded project repo")
    shelljs.exec(
        `git clone --branch scaffolded-project https://github.com/captain-woof/poly-scaffold ${projectRootDir}`,
        { cwd }
    );

    // Remove repo
    shelljs.rm("-rf", [`${cwd}/${projectRootDir}/.git`]);

    // Install deps in Smart contracts
    logInfoWithBg("Installing smart contract dependencies");
    shelljs.exec(
        "yarn",
        { cwd: `${cwd}/${projectRootDir}/smart-contracts` }
    );

    // Install deps in Frontend
    logInfoWithBg("Installing frontend dependencies");
    shelljs.exec(
        "yarn",
        { cwd: `${cwd}/${projectRootDir}/frontend` }
    );

    // Initialise new repo
    shelljs.exec(
        `git init; git add .; git commit -m "First commit";`,
        { cwd: `${cwd}/${projectRootDir}` }
    );

    logSuccessWithBg(`Project scaffolded! For help, go to '${projectRootDir}' and type 'poly-scaffold help'.`);
}