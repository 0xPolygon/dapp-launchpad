import styles from "./styles.module.css";

export default function InfoSection() {
    return (
        <div className={styles.infoSection}>
            <div className={styles.infoSectionInner}>
                <h2 className={styles.heading}>
                    Important Information for Developers
                </h2>

                <hr className={styles.divider} />

                <ul className={styles.list}>
                    {/** Blockchain running */}
                    <li className={styles.listItem}>
                        <h3 className={styles.heading}>
                            1. Local test blockchain
                        </h3>

                        <p className={styles.text}>
                            A local test blockchain is running, accessible at HTTP-RPC endpoint <u>http://localhost:8545</u>.
                        </p>
                    </li>

                    {/** Frontend running */}
                    <li className={styles.listItem}>
                        <h3 className={styles.heading}>
                            2. Local test frontend server
                        </h3>

                        <p className={styles.text}>
                            A local test frontend server is running, accessible at <u>http://localhost:3000</u> (you&apos;re seeing this right now).
                        </p>
                    </li>

                    {/** Modify Frontend */}
                    <li className={styles.listItem}>
                        <h3 className={styles.heading}>
                            3. Modifying frontend
                        </h3>

                        <p className={styles.text}>
                            To start modifying the frontend, edit <code>./frontend/src/pages/index.tsx</code>.
                        </p>
                    </li>

                    {/** Modify Smart contracts */}
                    <li className={styles.listItem}>
                        <h3 className={styles.heading}>
                            4. Modifying smart contracts
                        </h3>

                        <p className={styles.text}>
                            To start modifying the smart contracts, add your contracts in <code>./smart-contracts/contracts</code>, and update the deploy scripts in <code>./smart-contracts/scripts</code>.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    )
}
