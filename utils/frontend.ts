import shelljs from "shelljs";
import { logErrorWithBg, logInfoWithBg, logSuccessWithBg } from "./print";
import path from "path";
import { waitFor } from "./time";

/**
 * @description Starts local frontend dev server
 * @param {string} projectRootDir Root directory of the project
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
