/**
 * @description Waits for specified time
 * @param {number} timeInSecs Time to wait in seconds
 */
export const waitFor = (timeInSecs: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeInSecs * 1000);
    });
}

/**
 * @description Gets current time in UNIX ms
 * @returns Current time
 */
export const getCurrentTime = () => {
    return Date.now();
}

/**
 * @description Gets current time in human readable format
 * @returns Current time
 */
export const getCurrentHumanReadableTime = () => {
    const dateNow = new Date();

    return `${dateNow.getHours().toString().padStart(2, "0")}:${dateNow.getMinutes().toString().padStart(2, "0")}` // HH:MM
}
