import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ModuleNavIcon.css';

// ModuleNavIcon is a reusable component for clickable navigation icons
// that are positioned around the central GrimoireAltarView
const ModuleNavIcon = ({ moduleName, icon, onClick, style, activeModule }) => {
  // Determine if this icon represents the currently active module
  const isActive = activeModule === moduleName;
  
  return (
    <div 
      className={`module-nav-icon ${isActive ? 'active' : ''}`} 
      onClick={() => onClick(moduleName)}
      style={style} // For absolute positioning on the grimoire
      title={moduleName}
    >
      <div className="icon-container">
        <FontAwesomeIcon icon={icon} className="nav-icon" />
      </div>
      <div className="icon-pulse"></div>
    </div>
  );
};

export default ModuleNavIcon; 