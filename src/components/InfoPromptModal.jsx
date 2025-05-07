import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './InfoPromptModal.css';

// InfoPromptModal is a simple modal for displaying information messages
// with styling consistent with the game's theme
const InfoPromptModal = ({ 
  isOpen, 
  onClose,
  message,
  title = "Notice"
}) => {
  // Skip rendering if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="info-prompt-overlay">
      <div className="info-prompt-container">
        <div className="info-prompt-header">
          <h2><FontAwesomeIcon icon={faInfoCircle} /> {title}</h2>
          <button className="close-modal-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="info-prompt-content">
          <p className="info-prompt-message">{message}</p>
          
          <button 
            className="info-prompt-button" 
            onClick={onClose}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoPromptModal; 