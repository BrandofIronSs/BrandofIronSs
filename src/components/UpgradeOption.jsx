import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './UpgradeOption.css';

const UpgradeOption = ({ 
  name, 
  icon, 
  effect, 
  costs, 
  level, 
  maxLevel,
  disabled, 
  onClick 
}) => {
  const currentLevel = level || 0;

  return (
    <div className={`upgrade-option ${disabled ? 'disabled' : ''}`}>
      <div className="upgrade-icon-container">
        <FontAwesomeIcon icon={icon} className="upgrade-icon" />
      </div>
      
      <div className="upgrade-content">
        <div className="upgrade-header">
          <h3 className="upgrade-name">{name}</h3>
          <div className="upgrade-level">
            {Array(maxLevel).fill().map((_, i) => (
              <div 
                key={i} 
                className={`level-pip ${i < currentLevel ? 'filled' : ''}`}
              ></div>
            ))}
          </div>
        </div>
        
        <p className="upgrade-effect">{effect}</p>
        
        <div className="upgrade-costs">
          {costs.map((cost, index) => (
            <div key={index} className="upgrade-cost">
              <span className="cost-amount">{cost.amount}</span>
              <span className="cost-resource">{cost.resource}</span>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="upgrade-button"
        onClick={onClick}
        disabled={disabled || currentLevel >= maxLevel}
      >
        {currentLevel >= maxLevel ? 'MAXED' : 'UPGRADE'}
      </button>
    </div>
  );
};

export default UpgradeOption; 