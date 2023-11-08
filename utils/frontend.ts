import shelljs from "shelljs";
import { logSuccessWithBg } from "./print";
import path from "path";

/**
 * @description Starts local frontend dev server
 * @param {string} projectRootDir Root directory of the project
 */
export const startLocalFrontendDevServer = (projectRootDir: string) => {
    logSuccessWithBg("Starting frontend dev server: http://localhost:3000");

    return shelljs.exec(
        "npm run dev",
        {
            async: true,
            cwd: path.resolve(projectRootDir, "frontend")
        }
    )
}
