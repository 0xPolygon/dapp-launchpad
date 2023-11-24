import readline from "readline";

/**
 * @description Asks for user input
 * @param prompt Prompt for asking the question
 * @returns User's answer
 */
export const askUserInput = (prompt: string = "") => {
    return new Promise((resolve, reject) => {
        try {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(prompt, (answer) => {
                rl.close();
                resolve(answer ?? "");
            });
        } catch(e: any) {
            reject(e?.cause ?? e?.message ?? e);
        }
    });
}
