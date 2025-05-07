import React, { useState } from 'react';
import './WhispersOfFate.css';

// Whispers of Fate - Gacha/Pull System Component
const WhispersOfFate = ({ performPrayer, echoes = 0, updateResource }) => {
  // State for tracking prayer results and UI states
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [prayerResults, setPrayerResults] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedCards, setRevealedCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Current active pool (would be dynamic in a more complete implementation)
  const activePool = {
    id: 'standardPrayer',
    name: 'Whispers of the Beyond',
    description: 'Commune with the spirits to receive their blessings - materials, equipment, and rare treasures await.',
    singlePullCost: 10,
    tenPullCost: 90
  };
  
  // Rarity color mapping
  const rarityColors = {
    common: '#9e9e9e',     // Gray
    uncommon: '#4caf50',   // Green
    rare: '#2196f3',       // Blue
    epic: '#9c27b0',       // Purple
    legendary: '#ff9800'   // Orange/Gold
  };

  // Mock data for testing when performPrayer is not available
  const mockPrayerResults = (count) => {
    const rarities = ['common', 'common', 'uncommon', 'rare', 'epic', 'legendary'];
    const weights = [60, 30, 15, 8, 3, 1];
    const types = ['resource', 'item'];
    
    const getWeightedRandom = () => {
      const total = weights.reduce((a, b) => a + b, 0);
      let random = Math.random() * total;
      for (let i = 0; i < rarities.length; i++) {
        if (random < weights[i]) return rarities[i];
        random -= weights[i];
      }
      return rarities[0];
    };
    
    const results = [];
    for (let i = 0; i < count; i++) {
      const rarity = getWeightedRandom();
      const type = types[Math.floor(Math.random() * types.length)];
      
      results.push({
        id: `mock_${type}_${rarity}_${i}`,
        name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${type === 'resource' ? 'Material' : 'Equipment'}`,
        type: type === 'resource' ? 'Resource' : 'Equipment',
        icon: type === 'resource' ? '💎' : '⚔️',
        rarity: rarity,
        quantity: type === 'resource' ? Math.floor(Math.random() * 10) + 1 : undefined,
        description: `A ${rarity} ${type}`
      });
    }
    
    // Ensure at least one uncommon or better for 10 pulls
    if (count === 10 && !results.some(r => r.rarity !== 'common')) {
      results[0] = {
        ...results[0],
        rarity: 'uncommon',
        name: 'Uncommon Material',
      };
    }
    
    return results;
  };
  
  // Handle single pull
  const handleSinglePull = async () => {
    if (echoes < activePool.singlePullCost) {
      setErrorMessage('Insufficient echoes for a single whisper');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      let results;
      
      // Safe check for performPrayer function
      if (performPrayer && typeof performPrayer === 'function') {
        results = await performPrayer(activePool.id, 1);
      } else {
        // Use mock data if performPrayer is not available
        console.log('performPrayer function not provided, using mock data');
        results = mockPrayerResults(1);
        
        // Mock resource deduction
        if (typeof updateResource === 'function') {
          updateResource('echoes', -activePool.singlePullCost);
        }
        
        // Add delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setPrayerResults(Array.isArray(results) ? results : [results]);
      setRevealedCards([]);
      setShowResults(true);
      setTimeout(() => revealResults(Array.isArray(results) ? results : [results]), 500);
    } catch (error) {
      console.error('Prayer failed:', error);
      setErrorMessage('The spirits are silent. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle ten pull
  const handleTenPull = async () => {
    if (echoes < activePool.tenPullCost) {
      setErrorMessage('Insufficient echoes for a tenfold whisper');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      let results;
      
      // Safe check for performPrayer function
      if (performPrayer && typeof performPrayer === 'function') {
        results = await performPrayer(activePool.id, 10);
      } else {
        // Use mock data if performPrayer is not available
        console.log('performPrayer function not provided, using mock data');
        results = mockPrayerResults(10);
        
        // Mock resource deduction
        if (typeof updateResource === 'function') {
          updateResource('echoes', -activePool.tenPullCost);
        }
        
        // Add delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      setPrayerResults(Array.isArray(results) ? results : [results]);
      setRevealedCards([]);
      setShowResults(true);
      setTimeout(() => revealResults(Array.isArray(results) ? results : [results]), 500);
    } catch (error) {
      console.error('Prayer failed:', error);
      setErrorMessage('The spirits are silent. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Animate the reveal of result cards
  const revealResults = (results) => {
    setIsAnimating(true);
    
    // Reveal cards one by one with a slight delay
    const totalCards = results.length;
    for (let i = 0; i < totalCards; i++) {
      setTimeout(() => {
        setRevealedCards(prev => [...prev, i]);
        
        // If this is the last card, end the animation
        if (i === totalCards - 1) {
          setTimeout(() => setIsAnimating(false), 300);
        }
      }, i * 200); // Stagger the reveal
    }
  };
  
  // Close results modal
  const handleCloseResults = () => {
    setShowResults(false);
    setPrayerResults([]);
  };
  
  // Get a display name for an icon if needed
  const getIconDisplay = (icon) => {
    return icon || '✧'; // Default icon if none provided
  };
  
  // Render an individual result card
  const renderResultCard = (result, index) => {
    const isRevealed = revealedCards.includes(index);
    const isHighRarity = result.rarity === 'rare' || result.rarity === 'epic' || result.rarity === 'legendary';
    
    return (
      <div 
        key={`${result.id}-${index}`}
        className={`result-card ${isRevealed ? 'revealed' : ''} ${isHighRarity ? 'high-rarity' : ''} ${result.rarity}`}
        style={{
          '--rarity-color': rarityColors[result.rarity] || rarityColors.common,
          animationDelay: `${index * 0.1}s`
        }}
      >
        <div className="card-inner">
          <div className="card-front">
            <div className="card-symbol">?</div>
          </div>
          <div className="card-back">
            <div className="card-rarity-indicator"></div>
            <div className="card-icon">{getIconDisplay(result.icon)}</div>
            <div className="card-name">{result.name}</div>
            
            {/* Display additional details based on type */}
            {result.type && (
              <div className="card-type">
                {result.type}{result.subType ? ` - ${result.subType}` : ''}
                {result.job && ` (${result.job})`}
              </div>
            )}
            
            {/* Display quantity for stackable items */}
            {result.quantity && (
              <div className="card-quantity">×{result.quantity}</div>
            )}
            
            {/* Display quality for equipment */}
            {result.quality && (
              <div className="card-quality">{result.quality}</div>
            )}
            
            {/* Display rarity */}
            <div className={`card-rarity ${result.rarity}`}>
              {result.rarity.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the results grid
  const renderResultsGrid = () => {
    if (!showResults) return null;
    
    return (
      <div className="prayer-results-overlay">
        <div className="prayer-results-modal">
          <button className="close-results-button" onClick={handleCloseResults}>×</button>
          
          <h2 className="results-title">
            {prayerResults.length > 1 ? 'The Fates Reveal Their Whispers' : 'A Single Whisper Emerges'}
          </h2>
          
          <div className={`results-grid ${isAnimating ? 'animating' : ''} ${prayerResults.length > 5 ? 'ten-pull' : 'single-pull'}`}>
            {prayerResults.map((result, index) => renderResultCard(result, index))}
          </div>
          
          <button 
            className="claim-rewards-button"
            onClick={handleCloseResults}
            disabled={isAnimating}
          >
            Claim Rewards
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="whispers-of-fate-container">
      <div className="mystical-background">
        <div className="floating-symbol symbol-1">✧</div>
        <div className="floating-symbol symbol-2">✦</div>
        <div className="floating-symbol symbol-3">⚝</div>
        <div className="summoning-circle"></div>
      </div>
      
      <div className="whispers-header">
        <h2>Whispers of Fate</h2>
        <p>Commune with the Beyond and Alter Your Destiny</p>
      </div>
      
      <div className="pool-information">
        <h3 className="pool-name">{activePool.name}</h3>
        <p className="pool-description">{activePool.description}</p>
        
        <div className="echoes-display">
          <div className="echoes-icon">✧</div>
          <div className="echoes-count">{echoes}</div>
          <div className="echoes-label">Echoes</div>
        </div>
      </div>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <div className="prayer-buttons">
        <button 
          className="prayer-button single-prayer"
          onClick={handleSinglePull}
          disabled={isLoading || echoes < activePool.singlePullCost}
        >
          <div className="prayer-button-content">
            <span className="prayer-button-title">Whisper Once</span>
            <span className="prayer-button-cost">
              <span className="cost-icon">✧</span> {activePool.singlePullCost} ECHOES
            </span>
          </div>
        </button>
        
        <button 
          className="prayer-button ten-prayer"
          onClick={handleTenPull}
          disabled={isLoading || echoes < activePool.tenPullCost}
        >
          <div className="prayer-button-content">
            <span className="prayer-button-title">Heed Ten Omens</span>
            <span className="prayer-button-cost">
              <span className="cost-icon">✧</span> {activePool.tenPullCost} ECHOES
            </span>
            <span className="prayer-button-bonus">Guarantees at least one Uncommon or greater Echo</span>
          </div>
        </button>
      </div>
      
      <div className="pool-details-button-container">
        <button className="pool-details-button">
          View Pool Details
        </button>
      </div>
      
      {renderResultsGrid()}
    </div>
  );
};

export default WhispersOfFate;