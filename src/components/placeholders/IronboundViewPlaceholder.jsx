import React from 'react';
import './PlaceholderStyles.css';

const IronboundViewPlaceholder = ({ playerMercenaries, hireMercenary, dismissMercenary }) => {
  // Sample handler for the hire button - will be replaced with proper UI in the full component
  const handleHireSample = () => {
    // Randomly select between the three mercenary types
    const mercTypes = ['merc_guts_grunt', 'merc_nimble_rogue', 'merc_hedge_mage'];
    const randomType = mercTypes[Math.floor(Math.random() * mercTypes.length)];
    hireMercenary(randomType);
  };

  // Sample handler for dismiss button - will be replaced with proper UI in the full component
  const handleDismissSample = () => {
    if (playerMercenaries.length > 0) {
      // Dismiss the last mercenary in the list
      dismissMercenary(playerMercenaries[playerMercenaries.length - 1].instanceId);
    }
  };

  return (
    <div className="placeholder-module-view ironbound">
      <h1 className="placeholder-title">Ironbound Covenant</h1>
      <p className="placeholder-text">Warriors bound by iron oaths to serve your will...</p>
      
      {/* Display mercenary count and basic info */}
      <div className="placeholder-info">
        <h2>Mercenary Roster ({playerMercenaries ? playerMercenaries.length : 0})</h2>
        
        {/* Simple buttons for testing the functions */}
        <div className="placeholder-actions">
          <button 
            className="access-module-button" 
            onClick={handleHireSample}
          >
            Hire Random Mercenary
          </button>
          <button 
            className="access-module-button" 
            onClick={handleDismissSample}
            disabled={!playerMercenaries || playerMercenaries.length === 0}
          >
            Dismiss Last Mercenary
          </button>
        </div>
        
        {playerMercenaries && playerMercenaries.length > 0 ? (
          <ul className="mercenary-list">
            {playerMercenaries.map(merc => (
              <li key={merc.instanceId} className="mercenary-item">
                <div className="mercenary-name">{merc.name}</div>
                <div className="mercenary-job">Level {merc.level} {merc.job}</div>
                <div className="mercenary-stats">
                  STR: {merc.stats.strength} | AGI: {merc.stats.agility} | WILL: {merc.stats.willpower}
                </div>
                <div className="mercenary-san">SAN: {merc.currentSAN}/{merc.maxSAN}</div>
                {merc.skills.length > 0 && (
                  <div className="mercenary-skills">
                    Skills: {merc.skills.join(', ')}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No mercenaries currently under your command.</p>
        )}
        <p className="placeholder-note">
          The full Ironbound Covenant module is under development.
          This will allow recruiting, training, and sending mercenaries on missions.
        </p>
      </div>
    </div>
  );
};

// Default props to prevent errors if props aren't passed
IronboundViewPlaceholder.defaultProps = {
  playerMercenaries: [],
  hireMercenary: () => console.log("hireMercenary not implemented"),
  dismissMercenary: () => console.log("dismissMercenary not implemented")
};

export default IronboundViewPlaceholder; 