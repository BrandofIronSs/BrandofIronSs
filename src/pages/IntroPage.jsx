import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull } from '@fortawesome/free-solid-svg-icons';
import './IntroPage.css';

// The IntroPage component serves as the landing page for the Brand of Iron game
const IntroPage = ({ onStartGameClick }) => {
  return (
    <div className="intro-container bg-grimy">
      {/* Main title with thematic styling */}
      <h1 className="game-title">
        <span className="text-blood">Brand</span> of <span className="text-rust">Iron</span>
      </h1>
      
      {/* Subtitle or flavor text to set the dark atmosphere */}
      <p className="intro-text">
        Enter a realm scarred by darkness, where the marked wage eternal war...
      </p>
      
      <div className="intro-flavor-text">
        <p>The iron binds to flesh, the curse seeps into bone.</p>
        <p>As darkness falls, only the Ironbound survive.</p>
        <p>Will you rise to power or succumb to the brand?</p>
      </div>
      
      {/* Start Game button with iron/blood theme */}
      <button 
        className="iron-button start-button" 
        onClick={onStartGameClick}
      >
        <FontAwesomeIcon icon={faSkull} className="button-icon" />
        <span>Enter the Darkness</span>
      </button>
    </div>
  );
};

export default IntroPage; 