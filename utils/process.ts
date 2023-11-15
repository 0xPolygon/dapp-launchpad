import cp from "child_process";

interface IRunChildProcessOptions {
    mode?: "sync" | "sync-interactive" | "background",
    cwd?: string
}

interface IRunChildProcessReturn {
    process: cp.ChildProcess;
    code: null | number;
    stdoutContent: string;
    stderrContent: string;
}

/**
 * @description Runs a child process
 * @param command Command to run
 * @param args Arguments to pass to command
 * @param options Options to customise this process
 * @returns The creacted child process, stdout, stderr, exit code
 */
export const runChildProcess = (command: string, args: Array<any> = [], options: IRunChildProcessOptions = { mode: "sync", cwd: __dirname }): Promise<IRunChildProcessReturn> => {
    return new Promise((resolve, reject) => {
        // Spawn child process
        let stdoutChunks: Array<Uint8Array> = [], stderrChunks: Array<Uint8Array> = [];
        let stdoutContent = "", stderrContent = "";
        const process = cp.spawn(command, args, {
            cwd: options.cwd,
            detached: options.mode === "background",
            shell: true,
            stdio: options.mode === "sync-interactive" ? "inherit" : "pipe"
        });

        // Attach listeners
        process.stdout?.on('data', (data) => {
            stdoutChunks = stdoutChunks.concat(data);
        });

        process.stdout?.on('end', () => {
            stdoutContent = Buffer.concat(stdoutChunks).toString();
        });

        process.stderr?.on('data', (data) => {
            stderrChunks = stderrChunks.concat(data);
        });
        process.stderr?.on('end', () => {
            stderrContent = Buffer.concat(stderrChunks).toString();
        });
        process.on("exit", (code) => {
            return code === 0
                ? resolve({ process, code, stdoutContent, stderrContent })
                : reject({ process, code, stdoutContent, stderrContent });
        });

        // Return child process
        if (options.mode === "background") {
            return resolve({ process, code: null, stdoutContent: "", stderrContent: "" });
        }
    });
}