import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCoins, faExchangeAlt, faFire } from '@fortawesome/free-solid-svg-icons';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import './TreasuryModal.css';
import InfoPromptModal from './InfoPromptModal';

// TreasuryModal provides token swap functionality
// This modal allows users to make SOL top-up transactions
// and swap BerserkBoi tokens for Echoes and Gold
const TreasuryModal = ({ 
  isOpen, 
  onClose,
  berserkBoiBalance,
  echoesBalance,
  goldBalance,
  updateCoreResource
}) => {
  // State for inputs
  const [solAmount, setSolAmount] = useState('');
  const [berserkBoiToEchoes, setBerserkBoiToEchoes] = useState('');
  const [berserkBoiToGold, setBerserkBoiToGold] = useState('');
  
  // State for error messages
  const [echoeSwapError, setEchoeSwapError] = useState('');
  const [goldSwapError, setGoldSwapError] = useState('');
  
  // Tab navigation state - default to 'swap' as it's the functional part
  const [activeTab, setActiveTab] = useState('swap');
  
  // State for success notification modal
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for SOL transaction processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Get Solana connection and wallet
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  // Constants for exchange rates
  const SOL_TO_BERSERKBOI_RATE = 1000000; // 1 SOL = 1,000,000 BerserkBoi (updated rate)
  const BERSERKBOI_TO_ECHOES_RATE = 5; // 1 BerserkBoi = 5 Echoes
  const BERSERKBOI_TO_GOLD_RATE = 1000; // 1 BerserkBoi = 1000 Gold
  
  // User provided receiving address - this is where SOL will be sent
  const RECEIVING_WALLET_ADDRESS = 'Au5Ua6rHeC6B3Mxcphi7Fm3XZAkr23RuHKcq3eggvJ6M';
  
  // Calculate expected BerserkBoi from SOL
  const calculateExpectedBerserkBoi = () => {
    if (!solAmount || isNaN(solAmount) || parseFloat(solAmount) <= 0) {
      return 0;
    }
    return parseFloat(solAmount) * SOL_TO_BERSERKBOI_RATE;
  };
  
  // Calculate expected Echoes from BerserkBoi
  const calculateExpectedEchoes = () => {
    if (!berserkBoiToEchoes || isNaN(berserkBoiToEchoes) || parseFloat(berserkBoiToEchoes) <= 0) {
      return 0;
    }
    return parseFloat(berserkBoiToEchoes) * BERSERKBOI_TO_ECHOES_RATE;
  };
  
  // Calculate expected Gold from BerserkBoi
  const calculateExpectedGold = () => {
    if (!berserkBoiToGold || isNaN(berserkBoiToGold) || parseFloat(berserkBoiToGold) <= 0) {
      return 0;
    }
    return parseFloat(berserkBoiToGold) * BERSERKBOI_TO_GOLD_RATE;
  };
  
  // Handle SOL infusion
  const handleConfirmInfusion = useCallback(async () => {
    if (!publicKey || !solAmount || isProcessing) return;
    
    const sol = parseFloat(solAmount);
    if (isNaN(sol) || sol <= 0) {
      setFeedbackMessage("Please enter a valid SOL amount.");
      return;
    }

    setIsProcessing(true);
    setFeedbackMessage("Preparing transaction...");

    try {
      const lamports = sol * LAMPORTS_PER_SOL;
      const recipientPublicKey = new PublicKey(RECEIVING_WALLET_ADDRESS);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: lamports,
        })
      );

      // Get recent blockhash for transaction validity
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      setFeedbackMessage("Please sign the transaction in your wallet...");

      // Send transaction via wallet adapter
      const signature = await sendTransaction(transaction, connection);
      setFeedbackMessage(`Transaction sent! Signature: ${signature.substring(0,10)}... Confirming...`);
      console.log("Transaction submitted:", signature);

      // Basic transaction confirmation polling
      let confirmationStatus;
      let retries = 30; // About 15 seconds total (30 * 500ms)
      while (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
        try {
          const result = await connection.getSignatureStatus(signature, { searchTransactionHistory: true });
          confirmationStatus = result.value?.confirmationStatus;
          console.log("Confirmation status:", confirmationStatus);
          if (confirmationStatus === 'confirmed' || confirmationStatus === 'finalized') {
            break; // Exit loop on confirmation
          }
        } catch (e) {
          console.warn("Error fetching signature status:", e);
          // Keep polling unless error indicates failure
        }
        retries--;
      }

      if (confirmationStatus === 'confirmed' || confirmationStatus === 'finalized') {
        // Grant BerserkBoi upon confirmation
        const berserkBoiToAdd = Math.floor(sol * SOL_TO_BERSERKBOI_RATE);
        updateCoreResource('berserkBoiCurrency', berserkBoiToAdd); 
        
        // Show success message
        setSuccessMessage(`Success! ${berserkBoiToAdd.toLocaleString()} $BerserkBoi added to your account.`);
        setSuccessModalOpen(true);
        setFeedbackMessage(''); // Clear feedback message
        setSolAmount(''); // Clear input
      } else {
        setFeedbackMessage(`Transaction confirmation uncertain or failed. Status: ${confirmationStatus || 'Not found'}`);
        console.error("Transaction confirmation failed or timed out.");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      // Handle specific errors
      if (error.name === 'WalletSignTransactionError' || error.message?.includes('User rejected')) {
        setFeedbackMessage("Transaction rejected by user.");
      } else {
        setFeedbackMessage(`Transaction failed: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [publicKey, solAmount, isProcessing, connection, sendTransaction, updateCoreResource]);
  
  // Handle swap to Echoes
  const handleSwapToEchoes = () => {
    const amount = parseFloat(berserkBoiToEchoes);
    
    // Validate input
    if (!amount || isNaN(amount) || amount <= 0) {
      setEchoeSwapError('Please enter a valid amount.');
      return;
    }
    
    // Check if user has enough BerserkBoi
    if (amount > berserkBoiBalance) {
      setEchoeSwapError('Insufficient BerserkBoi balance.');
      return;
    }
    
    // Calculate Echoes to receive
    const echoesToReceive = amount * BERSERKBOI_TO_ECHOES_RATE;
    
    // Update resources
    updateCoreResource('berserkBoiCurrency', -amount);
    updateCoreResource('echoes', echoesToReceive);
    
    // Reset input and error
    setBerserkBoiToEchoes('');
    setEchoeSwapError('');
    
    // Show success message using modal instead of alert
    setSuccessMessage(`Successfully swapped ${amount} BerserkBoi for ${echoesToReceive} Echoes.`);
    setSuccessModalOpen(true);
  };
  
  // Handle swap to Gold
  const handleSwapToGold = () => {
    const amount = parseFloat(berserkBoiToGold);
    
    // Validate input
    if (!amount || isNaN(amount) || amount <= 0) {
      setGoldSwapError('Please enter a valid amount.');
      return;
    }
    
    // Check if user has enough BerserkBoi
    if (amount > berserkBoiBalance) {
      setGoldSwapError('Insufficient BerserkBoi balance.');
      return;
    }
    
    // Calculate Gold to receive
    const goldToReceive = amount * BERSERKBOI_TO_GOLD_RATE;
    
    // Update resources
    updateCoreResource('berserkBoiCurrency', -amount);
    updateCoreResource('gold', goldToReceive);
    
    // Reset input and error
    setBerserkBoiToGold('');
    setGoldSwapError('');
    
    // Show success message using modal instead of alert
    setSuccessMessage(`Successfully swapped ${amount} BerserkBoi for ${goldToReceive} Gold.`);
    setSuccessModalOpen(true);
  };
  
  // Skip rendering if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="treasury-modal-overlay">
      <div className="treasury-modal-container">
        <div className="treasury-modal-header">
          <h2><FontAwesomeIcon icon={faCoins} /> Aether Treasury</h2>
          <button className="close-modal-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="treasury-modal-content">
          {/* Current balance display */}
          <div className="treasury-balances">
            <div className="balance-item">
              <span className="balance-label">BerserkBoi:</span>
              <span className="balance-value">{berserkBoiBalance.toFixed(2)}</span>
            </div>
            <div className="balance-item">
              <span className="balance-label">Echoes:</span>
              <span className="balance-value">{echoesBalance}</span>
            </div>
            <div className="balance-item">
              <span className="balance-label">Gold:</span>
              <span className="balance-value">{goldBalance}</span>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="treasury-tabs">
            <button 
              className={`treasury-tab-button ${activeTab === 'top-up' ? 'active' : ''}`}
              onClick={() => setActiveTab('top-up')}
            >
              <FontAwesomeIcon icon={faFire} /> Infusion (Top-up)
            </button>
            <button 
              className={`treasury-tab-button ${activeTab === 'swap' ? 'active' : ''}`}
              onClick={() => setActiveTab('swap')}
            >
              <FontAwesomeIcon icon={faExchangeAlt} /> Transmute (Swap)
            </button>
          </div>
          
          {/* Conditional Content Rendering */}
          {activeTab === 'top-up' && (
            <div className="treasury-section">
              <h3><FontAwesomeIcon icon={faFire} /> Aether Infusion (SOL Top-up)</h3>
              
              <div className="treasury-rate-info">
                Rate: 1 SOL ≈ {SOL_TO_BERSERKBOI_RATE.toLocaleString()} $BerserkBoi
              </div>
              
              <div className="treasury-input-group">
                <label>SOL Amount:</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={solAmount}
                  onChange={(e) => setSolAmount(e.target.value)}
                  placeholder="Enter SOL amount"
                  disabled={isProcessing} 
                />
              </div>
              
              <div className="treasury-calculation">
                You will receive ≈ {calculateExpectedBerserkBoi().toLocaleString()} $BerserkBoi
              </div>
              
              {feedbackMessage && (
                <div className={`treasury-feedback ${isProcessing ? 'processing' : ''}`}>
                  {feedbackMessage}
                </div>
              )}
              
              <button 
                className={`treasury-button ${isProcessing ? 'processing-button' : ''} ${!publicKey ? 'connect-required' : ''}`}
                onClick={handleConfirmInfusion}
                disabled={isProcessing || !publicKey || !solAmount || parseFloat(solAmount) <= 0}
              >
                {isProcessing ? 'Processing...' : !publicKey ? 'Connect Wallet First' : 'Confirm Infusion'}
              </button>
              
              {!publicKey && (
                <div className="treasury-info-note">
                  Please connect your wallet using the button in the top-left corner.
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'swap' && (
            <div className="treasury-section">
              <h3><FontAwesomeIcon icon={faExchangeAlt} /> Transmute Aether (BerserkBoi Swap)</h3>
              
              {/* BerserkBoi to Echoes */}
              <div className="swap-subsection">
                <div className="treasury-rate-info">
                  Rate: 1 $BerserkBoi = {BERSERKBOI_TO_ECHOES_RATE} Echoes
                </div>
                
                <div className="treasury-input-group">
                  <label>$BerserkBoi Amount to Swap:</label>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    value={berserkBoiToEchoes}
                    onChange={(e) => setBerserkBoiToEchoes(e.target.value)}
                    placeholder="Enter BerserkBoi amount" 
                  />
                </div>
                
                <div className="treasury-calculation">
                  Receive: {calculateExpectedEchoes().toFixed(0)} Echoes
                </div>
                
                {echoeSwapError && <div className="treasury-error">{echoeSwapError}</div>}
                
                <button 
                  className="treasury-button" 
                  onClick={handleSwapToEchoes}
                >
                  Swap for Echoes
                </button>
              </div>
              
              {/* BerserkBoi to Gold */}
              <div className="swap-subsection">
                <div className="treasury-rate-info">
                  Rate: 1 $BerserkBoi = {BERSERKBOI_TO_GOLD_RATE} Gold
                </div>
                
                <div className="treasury-input-group">
                  <label>$BerserkBoi Amount to Swap:</label>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    value={berserkBoiToGold}
                    onChange={(e) => setBerserkBoiToGold(e.target.value)}
                    placeholder="Enter BerserkBoi amount" 
                  />
                </div>
                
                <div className="treasury-calculation">
                  Receive: {calculateExpectedGold().toFixed(0)} Gold
                </div>
                
                {goldSwapError && <div className="treasury-error">{goldSwapError}</div>}
                
                <button 
                  className="treasury-button" 
                  onClick={handleSwapToGold}
                >
                  Swap for Gold
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Success notification modal */}
      <InfoPromptModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Transmutation Successful"
        message={successMessage}
      />
    </div>
  );
};

export default TreasuryModal; 