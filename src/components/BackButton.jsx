import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './BackButton.css';

// BackButton component for returning to the base view from module views
// It appears as a rotated plus icon (+) to represent an X or close button
const BackButton = ({ onClick, style }) => {
  return (
    <div 
      className="back-button" 
      onClick={onClick}
      style={style}
      title="Return to Altar"
    >
      <div className="back-button-content">
        <FontAwesomeIcon 
          icon={faPlus} 
          className="back-icon" 
          rotation={45} // Rotates the plus to make an X
        />
      </div>
    </div>
  );
};

export default BackButton; 