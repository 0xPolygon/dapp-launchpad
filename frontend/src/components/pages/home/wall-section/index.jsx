import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useSmartContract } from "@/hooks/useSmartContract";
import { useWallet } from "@/hooks/useWallet";

export default function WallSection() {
    const [messageToPost, setMessageToPost] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const { getSmartContract, deployedNetworkData } = useSmartContract();
    const { walletConnectionStatus, switchNetwork, chainCurrent } = useWallet();
    const [poller, setPoller] = useState();
    const [error, setError] = useState("");
    const [isSending, setIsSending] = useState(false);

    /**
     * @description Handles sending message
     */
    const onSend = async () => {
        setError("");
        const wallContract = getSmartContract("WALL");
        try {
            setIsSending(true);

            if (wallContract && walletConnectionStatus === "connected" && switchNetwork && deployedNetworkData) {
                switchNetwork(deployedNetworkData.chainId);

                await (await wallContract.postMessage(messageToPost)).wait();
                syncMessages();
                setMessageToPost("");
            } else {
                throw Error();
            }
        } catch (e) {
            console.error(e);
            setError("Failed to send message");
        } finally {
            setIsSending(false);
        }
    }

    /**
     * @description Handles syncing messages
     */
    const syncMessages = () => {
        const _doSync = async () => {
            setError("");
            const wallContract = getSmartContract("WALL");

            try {
                if (walletConnectionStatus === "connected" && wallContract) {
                    const allMessagesNew = await wallContract.getAllPostedMessages();
                    setAllMessages(allMessagesNew);
                }
            } catch (e) {
                console.error(e);
                setError("Failed to sync all messages");
            }
        }

        clearInterval(poller);

        if (walletConnectionStatus === "connected") {
            _doSync();
            setPoller(setInterval(
                _doSync,
                10 * 1000
            ));
        }
    }

    // Sync messages on load
    useEffect(syncMessages, [walletConnectionStatus])

    // Switch chain on load
    useEffect(() => {
        if (chainCurrent?.id !== deployedNetworkData?.chainId) {
            switchNetwork && switchNetwork(deployedNetworkData?.chainId);
        }
    }, [chainCurrent, deployedNetworkData])

    return (
        <div className={styles.wallSection}>
            <div className={styles.wallSectionInner}>
                <h2 className={styles.heading}>
                    Message wall
                </h2>

                <hr className={styles.divider} />

                <ul className={styles.list}>
                    {allMessages.map(({ message, sender, timestamp }, index) => (
                        <li key={index} className={styles.listItem}>
                            <p className={styles.text}>{sender.slice(0, 7)}... | {new Date(parseInt(timestamp.toString()) * 1000).toLocaleTimeString()} &gt; {message}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <form className={styles.sendMessage} onSubmit={(e) => {
                e.preventDefault();
                onSend();
            }}>
                <input className={styles.input} placeholder="Write your message" value={messageToPost} onChange={(e) => setMessageToPost(e.target.value)} disabled={isSending} />
                <button className={styles.btn} disabled={!messageToPost || isSending} type="submit">&gt;</button>
            </form>

            <pre className={styles.error}>
                {error}
            </pre>
        </div>
    )
}
