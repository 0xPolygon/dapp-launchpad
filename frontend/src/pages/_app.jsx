import WalletProvider from '@/components/providers/wallet'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  )
}
