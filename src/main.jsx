import React, { useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

// Import the wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

// Add buffer polyfill
import { Buffer } from 'buffer'
window.Buffer = Buffer

const AppWrapper = () => {
  // Configure Solana network for mainnet-beta
  const network = WalletAdapterNetwork.Mainnet
  console.log(`Using Solana ${network} network`)
  
  // WARNING: Exposing API keys directly in the frontend is highly insecure 
  // and not recommended for production. This is only for testing purposes.
  // In production, these requests should be proxied through a backend service.
  const HELIUS_API_KEY = '4fb05a4e-b999-4375-b303-6d4a57ad32d4'
  const heliusRpcUrl = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  
  // Use Helius endpoint directly instead of the public RPC
  const endpoint = heliusRpcUrl

  // Initialize wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(), 
      new SolflareWalletAdapter()
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

// Make sure ethereum property doesn't cause conflicts
const safelySetupWallet = () => {
  try {
    createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <AppWrapper />
      </React.StrictMode>
    )
  } catch (error) {
    console.error("Error initializing wallet:", error)
    // Fallback to render without wallet integration if it fails
    createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}

safelySetupWallet()
