import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapSigns } from '@fortawesome/free-solid-svg-icons';
import './ExplorationEventModal.css';

const ExplorationEventModal = ({ event, onChoiceSelected, onCloseEvent }) => {
  if (!event) return null;
  
  const handleChoiceClick = (choice) => {
    onChoiceSelected(choice.outcome);
  };
  
  return (
    <div className="event-modal-overlay">
      <div className="event-modal">
        <div className="event-header">
          <h2><FontAwesomeIcon icon={faMapSigns} /> Expedition Event</h2>
          <button className="close-event-button" onClick={onCloseEvent}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="event-content">
          <p className="event-description">{event.description}</p>
          
          <div className="event-choices">
            <h3>Choose Your Action:</h3>
            {event.choices.map((choice, index) => (
              <button 
                key={index} 
                className="event-choice-button"
                onClick={() => handleChoiceClick(choice)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorationEventModal; 