import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCoins, faDroplet, faSkull, 
  faDollarSign, faBoxArchive, faDoorOpen
} from '@fortawesome/free-solid-svg-icons';
import './ResourceDisplay.css';
import DevTools from './DevTools';

// ResourceDisplay component shows player's current resources in left panel
const ResourceDisplay = ({ 
  onStashClick, 
  onReturnToTitle,
  gold, 
  vitaeEssence, 
  behelitShard, 
  echoes, 
  berserkBoiCurrency,
  addResource,
  finishExplorationNow,
  addExperienceToSelectedMerc,
  selectedMercId,
  addIronOre,
  addSteelIngot,
  addLeather,
  addWood
}) => {
  // Resource types with their display information - updated to only show 5 core resources
  const resources = [
    { name: 'Gold', icon: faCoins, amount: gold, color: '#ffd700', isCustomIcon: false },
    { name: 'Vitae Essence', icon: faDroplet, amount: vitaeEssence, color: '#ff6b6b', isCustomIcon: false },
    { name: 'Behelit Shard', icon: faSkull, amount: behelitShard, color: '#dc143c', isCustomIcon: false },
    { name: 'Echoes', icon: '✧', amount: echoes, color: '#9370db', isCustomIcon: true },
    { name: '$BerserkBoi', icon: faDollarSign, amount: berserkBoiCurrency, color: '#32cd32', isCustomIcon: false },
  ];

  return (
    <div className="resources-display">
      <h3 className="section-title">RESOURCES</h3>
      <div className="resources-grid">
        {resources.map((resource, index) => (
          <div key={index} className="resource-item">
            {resource.isCustomIcon ? (
              <span 
                className="custom-resource-icon" 
                style={{ color: resource.color }}
              >
                {resource.icon}
              </span>
            ) : (
              <FontAwesomeIcon 
                icon={resource.icon} 
                style={{ color: resource.color }}
                className="resource-icon"
              />
            )}
            <div className="resource-details">
              <span className="resource-name">{resource.name}</span>
              <span className="resource-amount">{resource.amount}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Stash button */}
      <div className="stash-button-container">
        <button 
          className="stash-button" 
          onClick={() => onStashClick('Stash')}
        >
          <FontAwesomeIcon 
            icon={faBoxArchive} 
            className="stash-icon"
          />
          <span className="stash-text">Stash</span>
        </button>
      </div>
      
      {/* Leave Sanctuary button */}
      <div className="stash-button-container">
        <button 
          className="stash-button leave-sanctuary-button" 
          onClick={onReturnToTitle}
        >
          <FontAwesomeIcon 
            icon={faDoorOpen} 
            className="stash-icon"
          />
          <span className="stash-text">Leave Sanctuary</span>
        </button>
      </div>
      
      {/* Dev Tools */}
      {addResource && finishExplorationNow && (
        <DevTools 
          addResource={addResource}
          finishExplorationNow={finishExplorationNow}
          addExperienceToSelectedMerc={addExperienceToSelectedMerc}
          selectedMercId={selectedMercId}
          addIronOre={addIronOre}
          addSteelIngot={addSteelIngot}
          addLeather={addLeather}
          addWood={addWood}
        />
      )}
    </div>
  );
};

// Default props for development/testing
ResourceDisplay.defaultProps = {
  gold: 100,
  vitaeEssence: 200,
  behelitShard: 10,
  echoes: 10,
  berserkBoiCurrency: 15,
  onStashClick: () => {},
  onReturnToTitle: () => {}
};

export default ResourceDisplay; 