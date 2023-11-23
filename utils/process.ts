import cp from "child_process";

interface IRunChildProcessOptions {
    mode?: "sync" | "sync-interactive" | "background";
    cwd?: string;
    env?: { [envName: string]: string };
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
        const childProcess = cp.spawn(command, args, {
            cwd: options.cwd,
            detached: options.mode === "background",
            shell: true,
            stdio: options.mode === "sync-interactive" ? "inherit" : "pipe",
            env: {
                ...process.env,
                ...(options.env ?? {})
            }
        });

        // Attach listeners
        childProcess.stdout?.on('data', (data) => {
            stdoutChunks = stdoutChunks.concat(data);
        });

        childProcess.stdout?.on('end', () => {
            stdoutContent = Buffer.concat(stdoutChunks).toString();
        });

        childProcess.stderr?.on('data', (data) => {
            stderrChunks = stderrChunks.concat(data);
        });
        childProcess.stderr?.on('end', () => {
            stderrContent = Buffer.concat(stderrChunks).toString();
        });
        childProcess.on("exit", (code) => {
            return code === 0
                ? resolve({ process: childProcess, code, stdoutContent, stderrContent })
                : reject({ process: childProcess, code, stdoutContent, stderrContent });
        });

        // Return child process
        if (options.mode === "background") {
            return resolve({ process: childProcess, code: null, stdoutContent: "", stderrContent: "" });
        }
    });
}
