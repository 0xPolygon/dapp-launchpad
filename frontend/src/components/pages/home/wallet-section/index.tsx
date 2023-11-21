import ConnectButton from "@/components/common/connect-btn";
import styles from "./styles.module.css";

export default function WalletSection() {

    return (
        <div className={styles.connectWallet}>
            {/** Logo */}
            <img src="/images/logo.svg" alt="logo" className={styles.logo} />

            {/** Heading */}
            <div className={styles.heading}>
                {/** Indicator */}
                <div className={styles.indicator}></div>

                {/** Text */}
                <h1 className={styles.text}>Your local server is running</h1>
            </div>

            {/** Sub heading */}
            <h2 className={styles.subheading}>Connect wallet to test functionalities</h2>

            {/** Connect button */}
            <div className={styles.btnContainer}>
                <ConnectButton />
            </div>
        </div>
    )
}