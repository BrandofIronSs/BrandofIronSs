import React from 'react';
import './PlayerProfileModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserShield } from '@fortawesome/free-solid-svg-icons';

function PlayerProfileModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null; // Don't render anything if not open
  }

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Overlay closes modal */}
      <div className="modal-content player-profile-modal" onClick={e => e.stopPropagation()}> {/* Content prevents overlay click */}
        <button className="modal-close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="thematic-title modal-title">Warden's Dossier</h2>
        {/* --- Placeholder Content --- */}
        <div className="modal-body">
          <p>Your deeds are yet to be fully chronicled...</p>
          <p>(Player statistics, achievements, and settings will appear here.)</p>
          {/* Add a placeholder for Avatar/Title here if desired */}
          <div className="profile-avatar">
            <FontAwesomeIcon icon={faUserShield} className="profile-icon" />
            <p className="profile-title">The Ironbranded</p>
          </div>
        </div>
        {/* --- End Placeholder --- */}
      </div>
    </div>
  );
}

export default PlayerProfileModal; 