import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './RitualButton.css';

const RitualButton = ({ 
  name, 
  icon, 
  costs, 
  description, 
  disabled, 
  onClick 
}) => {
  return (
    <button 
      className={`ritual-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="ritual-icon-container">
        <FontAwesomeIcon icon={icon} className="ritual-icon" />
        <div className="ritual-glow"></div>
      </div>
      
      <div className="ritual-content">
        <h3 className="ritual-name">{name}</h3>
        
        <div className="ritual-costs">
          {costs.map((cost, index) => (
            <div key={index} className="ritual-cost">
              <span className="cost-amount">{cost.amount}</span>
              <span className="cost-resource">{cost.resource}</span>
            </div>
          ))}
        </div>
        
        <p className="ritual-description">{description}</p>
      </div>
      
      <div className="ritual-runes">
        <div className="rune rune-1"></div>
        <div className="rune rune-2"></div>
        <div className="rune rune-3"></div>
      </div>
    </button>
  );
};

export default RitualButton; 