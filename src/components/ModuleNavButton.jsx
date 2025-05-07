import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ModuleNavButton.css';

// ModuleNavButton is a reusable component for clickable navigation buttons
// that are positioned around the central GrimoireAltarView
// It displays both an icon and the module name text
const ModuleNavButton = ({ moduleName, icon, onClick, style, activeModule }) => {
  // Determine if this button represents the currently active module
  const isActive = activeModule === moduleName;
  
  return (
    <div 
      className={`module-nav-button ${isActive ? 'active' : ''}`} 
      onClick={() => onClick(moduleName)}
      style={style} // For absolute positioning on the grimoire
    >
      <div className="button-container">
        {/* Icon at the top */}
        <div className="icon-container">
          <FontAwesomeIcon icon={icon} className="nav-icon" />
        </div>
        
        {/* Module name text below the icon */}
        <div className="module-name">
          {moduleName}
        </div>
      </div>
      <div className="button-pulse"></div>
    </div>
  );
};

export default ModuleNavButton; 