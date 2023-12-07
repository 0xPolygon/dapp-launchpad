import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import React from 'react'
import { WagmiConfig } from 'wagmi'
import { supportedChains } from './chains'

// Config for WC v3
const metadata = {
    name: 'dApp Launchpad project',
    description: 'A simple POC project initialised by dApp Launchpad',
    url: 'https://127.0.0.1',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}
const wagmiConfig = defaultWagmiConfig({
    chains: supportedChains,
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    metadata
})
createWeb3Modal({
    wagmiConfig,
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    chains: supportedChains
})

export default function WalletProvider({ children }) {
    return (
        <WagmiConfig config={wagmiConfig}>
            {children}
        </WagmiConfig>
    )
}
