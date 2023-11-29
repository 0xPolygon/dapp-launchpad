import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork, useDisconnect } from "wagmi";

/**
 * @description Useful methods and data about Wallet
 */
export const useWallet = () => {
    const { open: showConnectDialog, close: closeConnectDialog } = useWeb3Modal();
    const { open: isConnectDialogOpen } = useWeb3ModalState();
    const { address: walletAddress, status: walletConnectionStatus, connector } = useAccount();
    const { disconnect: disconnectWallet } = useDisconnect();
    const { chain: chainCurrent } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();

    // Keep Ethers provider and signer updated for Wallet
    const [ethersProvider, setEthersProvider] = useState(null);
    const [ethersSigner, setEthersSigner] = useState(null);
    useEffect(() => {
        if (connector) {
            (async () => {
                const provider = await connector.getProvider();
                const ethersProviderNew = new ethers.BrowserProvider(provider);
                const ethersSignerNew = await ethersProviderNew.getSigner();

                setEthersProvider(ethersProviderNew);
                setEthersSigner(ethersSignerNew);
            })();
        } else {
            setEthersProvider(null);
            setEthersSigner(null);
        }
    }, [connector, walletAddress])

    return {
        // Data
        isConnectDialogOpen,
        walletAddress,
        walletConnectionStatus: (walletConnectionStatus === "connected") ? (ethersSigner ? "connected" : "connecting") : walletConnectionStatus,
        ethersProvider,
        chainCurrent,
        ethersSigner,


        // Methods
        showConnectDialog,
        closeConnectDialog,
        disconnectWallet,
        switchNetwork
    }
}
