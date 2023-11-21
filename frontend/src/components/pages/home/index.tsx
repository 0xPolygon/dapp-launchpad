import WalletSection from "./wallet-section";
import styles from "./styles.module.css";
import { useWallet } from "@/hooks/useWallet";
import InfoSection from "./info-section";
import WallSection from "./wall-section";

export default function Home() {
    const { walletConnectionStatus } = useWallet();

    return (
        <div className={styles.home}>
            <section className={styles.col1}>
                <WalletSection />
            </section>

            <section className={styles.col2}>
                {walletConnectionStatus === "connected"
                    ? <WallSection />
                    : <InfoSection />
                }
            </section>
        </div>
    )
}
