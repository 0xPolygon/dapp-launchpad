import shelljs from "shelljs";
import { logErrorWithBg, logInfoWithBg, logSuccessWithBg } from "./print";
import path from "path";
import { waitFor } from "./time";
import { runChildProcess } from "./process";

/**
 * @description Starts local frontend dev server
 * @param projectRootDir Root directory of the project
 */
export const startLocalFrontendDevServer = (projectRootDir: string) => {
    logInfoWithBg("Starting frontend dev server: http://localhost:3000");

    return shelljs.exec(
        "npm run dev",
        {
            async: true,
            cwd: path.resolve(projectRootDir, "frontend")
        }
    )
}

/**
 * @description Waits for local frontend dev server to start
 */
export const waitForLocalFrontendDevServerToStart = async () => {
    while (true) {
        try {
            await fetch("http://127.0.0.1:3000");
            logSuccessWithBg("Started local frontend dev server: http://127.0.0.1:3000");
            break;
        } catch (e: any) {
            if (e.cause.toString().includes("ECONNREFUSED")) { // If RPC has not started yet
                await waitFor(2);
            } else {
                logErrorWithBg("Failed to start local frontend dev server; ", e.cause);
                throw e;
            }
        }
    }
}

/**
 * @description Logs in to Vercel
 * @param projectRootDir Root directory of the project
 */
export const loginToVercel = async (projectRootDir: string) => {
    try {
        await runChildProcess("npx vercel login", [], {
            cwd: path.resolve(projectRootDir, "frontend"),
            mode: "sync-interactive"
        });
        logSuccessWithBg("Logged in to Vercel");
    } catch (error) {
        logErrorWithBg("Failed to login");
        throw error;
    }
}

/**
 * @description Deploys frontend
 * @param projectRootDir Root directory of the project
 */
export const deployFrontendToProduction = async (projectRootDir: string) => {
    async function _performDeployment() {
        // Run deploy command
        await runChildProcess(
            "npx vercel deploy",
            [
                "--prod",
                "--force"
            ],
            {
                cwd: path.resolve(projectRootDir, "frontend"),
                mode: "sync-interactive"
            });
    }

    try {
        // Try deploying
        logInfoWithBg("Deploying Frontend");
        await _performDeployment();
    } catch (e: any) {
        // If no login creds exist, attempt login
        if (e.stderrContent.includes("No existing credentials found")) {
            logInfoWithBg("Not logged in to Vercel. Attempting login.");
            await loginToVercel(projectRootDir);

            // If login succeeds, perform deploy
            await _performDeployment();
        } else {
            // If any other error
            throw Error(e);
        }
    }
}
