import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUserCheck, faExclamationTriangle, faSync } from '@fortawesome/free-solid-svg-icons';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import './GrimoireAltarView.css';
import InfoPromptModal from './InfoPromptModal';

// Error Boundary component for wallet connection
class WalletErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Wallet error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="wallet-error">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>Wallet Error</span>
        </div>
      );
    }

    return this.props.children;
  }
}

// The GrimoireAltarView is the central visual element of the game UI
// It represents the cursed altar/grimoire that serves as the focal point for interactions
// This component is rendered directly in the base view state
const GrimoireAltarView = ({ onTreasuryClick }) => {
  // Local state to track wallet errors
  const [walletError, setWalletError] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  
  // Get the wallet context - always call hooks outside of conditional blocks
  const wallet = useWallet();
  let publicKey, connected, connecting;
  
  // Process wallet data with error handling
  try {
    publicKey = wallet?.publicKey;
    connected = wallet?.connected;
    connecting = wallet?.connecting;
  } catch (error) {
    console.error("Error accessing wallet:", error);
    setWalletError(true);
  }
  
  // Function to shorten address for display
  const shortenAddress = (address, chars = 4) => {
    if (!address) return '';
    try {
      const addressString = address.toString();
      return `${addressString.substring(0, chars)}...${addressString.substring(addressString.length - chars)}`;
    } catch (error) {
      console.error("Error formatting address:", error);
      return 'Invalid Address';
    }
  };
  
  // Log wallet connection status for debugging
  useEffect(() => {
    try {
      if (connected) {
        console.log('Wallet connected:', publicKey?.toString());
      } else if (connecting) {
        console.log('Wallet connecting...');
      } else {
        console.log('Wallet disconnected');
      }
    } catch (error) {
      console.error("Wallet monitoring error:", error);
      setWalletError(true);
    }
  }, [connected, connecting, publicKey]);

  // Handle central button click based on wallet connection status
  const handleCentralButtonClick = () => {
    if (!walletError && connected && publicKey) {
      // Wallet is connected, open the Treasury modal
      onTreasuryClick();
    } else if (!connecting) {
      // Wallet not connected and not in connecting state, show modal prompt
      setShowPromptModal(true);
    }
    // Do nothing when in connecting state
  };

  // Determine content to render in the player profile button
  const renderProfileButtonContent = () => {
    if (!walletError && connected && publicKey) {
      // Connected state
      return (
        <>
          <FontAwesomeIcon icon={faUserCheck} className="profile-button-icon" />
          <span className="profile-button-text">
            {shortenAddress(publicKey)}
          </span>
        </>
      );
    } else if (connecting) {
      // Connecting state (during auto-reconnect)
      return (
        <>
          <FontAwesomeIcon icon={faSync} className="profile-button-icon connecting-icon" spin />
          <span className="profile-button-text">
            Connecting...
          </span>
        </>
      );
    } else {
      // Disconnected state
      return (
        <>
          <FontAwesomeIcon icon={faUserShield} className="profile-button-icon" />
          <span className="profile-button-text">Warden</span>
        </>
      );
    }
  };

  return (
    <div className="grimoire-container">
      {/* Connect Wallet button in the top-left corner using WalletMultiButton */}
      <div className="wallet-button-container">
        <WalletErrorBoundary>
          <WalletMultiButton className="wallet-multi-button" />
        </WalletErrorBoundary>
      </div>
      
      {/* Main central grimoire/altar object */}
      <div className="grimoire-altar">
        {/* Center emblem/sigil */}
        <div className="grimoire-center">
          <div className="brand-symbol"></div>
        </div>
        
        {/* Pages/surfaces of the grimoire */}
        <div className="grimoire-surface left-page"></div>
        <div className="grimoire-surface right-page"></div>
        
        {/* Player profile button in the center - conditionally show wallet address or "Warden" */}
        <button 
          className={`player-profile-button ${connecting ? 'connecting' : ''}`}
          onClick={handleCentralButtonClick}
          aria-label="Open Treasury or Connect Wallet"
          disabled={connecting}
        >
          {renderProfileButtonContent()}
        </button>
      </div>
      
      {/* Info Prompt Modal */}
      <InfoPromptModal
        isOpen={showPromptModal}
        onClose={() => setShowPromptModal(false)}
        title="Connection Required"
        message="Please connect your Solana wallet first using the button in the top-left."
      />
    </div>
  );
};

export default GrimoireAltarView; 