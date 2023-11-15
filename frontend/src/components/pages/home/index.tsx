import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import ConnectButton from "@/components/common/connect-btn";
import { useSmartContract } from "@/hooks/useSmartContract";
import { Wall } from "@/types/typechain-types";
import { useWallet } from "@/hooks/useWallet";

export default function Home() {
    const [messageToPost, setMessageToPost] = useState("");
    const [allMessages, setAllMessages] = useState<Wall.MessageStructOutput[]>([]);
    const { getSmartContract, deployedNetworkData } = useSmartContract();
    const { walletConnectionStatus, switchNetwork, chainCurrent } = useWallet();
    const [poller, setPoller] = useState<ReturnType<typeof setInterval>>();
    const [error, setError] = useState("");

    /**
     * @description Handles sending message
     */
    const onSend = async () => {
        setError("");
        const wallContract = getSmartContract<Wall>("WALL");
        try {
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
        }
    }

    /**
     * @description Syncs messages
     */
    const syncMessages = () => {
        const _doSync = async () => {
            setError("");
            const wallContract = getSmartContract<Wall>("WALL");

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

    // Sync messages
    useEffect(syncMessages, [walletConnectionStatus])

    // Switch chain
    useEffect(() => {
        if (chainCurrent?.id !== deployedNetworkData?.chainId) {
            switchNetwork && switchNetwork(deployedNetworkData?.chainId);
        }
    }, [chainCurrent, deployedNetworkData])

    return (
        <div className={styles.home}>
            {/** Errors */}
            {error &&
                <pre>{error}</pre>
            }

            {/** Connect button */}
            <ConnectButton />

            {/** Send message */}
            {walletConnectionStatus === "connected" &&
                <div>
                    <h1>Send message</h1>
                    {/** Input */}
                    <input value={messageToPost} onChange={(e) => setMessageToPost(e.target.value)} placeholder="Write your message" />

                    {/** Send button */}
                    <button onClick={onSend}>
                        Send
                    </button>
                </div>
            }

            {/** List of messages */}
            {walletConnectionStatus === "connected" &&
                <div>
                    <h1>All messages</h1>
                    <ul>
                        {allMessages.map(({ message, sender, timestamp }, index) => (
                            <li key={index}>
                                <pre>{new Date(parseInt(timestamp.toString()) * 1000).toLocaleString()}</pre>
                                <b>{sender} says...</b>
                                <p>{message}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    )
}
