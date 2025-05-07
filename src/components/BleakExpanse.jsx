import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTree, faTowerObservation, faHourglass, 
  faCircleCheck, faTimes, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import ExplorationEventModal from './ExplorationEventModal';
import './BleakExpanse.css';

// Main component for the Bleak Expanse exploration module
const BleakExpanse = forwardRef(({ 
  playerMercenaries,
  calculateSquadPower,
  bleakExpanseState,
  setBleakExpanseState,
  // New global exploration props
  activeExplorationTask,
  startNewExploration,
  completeExploration
}, ref) => {
  // Track if we've initialized from parent state to prevent circular updates
  const isInitialized = useRef(false);
  
  // Local component state - keeping UI state local
  const [selectedArea, setSelectedArea] = useState(bleakExpanseState?.selectedArea || null);
  const [selectedSquad, setSelectedSquad] = useState(bleakExpanseState?.selectedSquad || []);
  const [showSquadModal, setShowSquadModal] = useState(bleakExpanseState?.showSquadModal || false);
  const [lastRewards, setLastRewards] = useState(bleakExpanseState?.lastRewards || null);
  const [lastCombatResult, setLastCombatResult] = useState(bleakExpanseState?.lastCombatResult || null);
  const [expeditionEvents, setExpeditionEvents] = useState(bleakExpanseState?.expeditionEvents || []);
  const [activeEvent, setActiveEvent] = useState(bleakExpanseState?.activeEvent || null);
  
  // Derived state from global exploration task
  const isExploring = Boolean(activeExplorationTask);
  // Use ref for timer values to avoid triggering renders
  const secondsRemainingRef = useRef(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  
  // Initialize from parent state once on mount
  useEffect(() => {
    if (!isInitialized.current && bleakExpanseState) {
      if (bleakExpanseState.selectedArea) setSelectedArea(bleakExpanseState.selectedArea);
      if (bleakExpanseState.selectedSquad) setSelectedSquad(bleakExpanseState.selectedSquad);
      if (bleakExpanseState.showSquadModal) setShowSquadModal(bleakExpanseState.showSquadModal);
      if (bleakExpanseState.lastRewards) setLastRewards(bleakExpanseState.lastRewards);
      if (bleakExpanseState.lastCombatResult) setLastCombatResult(bleakExpanseState.lastCombatResult);
      if (bleakExpanseState.expeditionEvents) setExpeditionEvents(bleakExpanseState.expeditionEvents);
      if (bleakExpanseState.activeEvent) setActiveEvent(bleakExpanseState.activeEvent);
      
      isInitialized.current = true;
    }
  }, [bleakExpanseState]);
  
  // Update seconds remaining with an interval timer instead of recalculating on every render
  useEffect(() => {
    let timer;
    if (isExploring && activeExplorationTask) {
      // Initial calculation
      const calcTimeRemaining = () => Math.max(0, Math.ceil((activeExplorationTask.endTime - Date.now()) / 1000));
      const initialSeconds = calcTimeRemaining();
      secondsRemainingRef.current = initialSeconds;
      setSecondsRemaining(initialSeconds);
      
      // Set up interval to update the time every second
      timer = setInterval(() => {
        const timeLeft = calcTimeRemaining();
        // Only update state if the value actually changed
        if (secondsRemainingRef.current !== timeLeft) {
          secondsRemainingRef.current = timeLeft;
          setSecondsRemaining(timeLeft);
        }
        
        // Clear interval when time runs out
        if (timeLeft <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    } else {
      secondsRemainingRef.current = 0;
      setSecondsRemaining(0);
    }
    
    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExploring, activeExplorationTask]);
  
  // Update the parent BleakExpanse state when local state changes
  // Use a debounced update to prevent constant re-renders
  useEffect(() => {
    // Skip the first render to avoid circular updates
    if (!isInitialized.current) return;
    
    // Create a stable object for parent state updates
    // Use the ref value for secondsRemaining to avoid triggering this effect on timer ticks
    const stateUpdate = {
      selectedArea,
      isExploring,
      secondsRemaining: secondsRemainingRef.current,
      lastRewards,
      selectedSquad,
      showSquadModal,
      lastCombatResult,
      expeditionEvents,
      activeEvent
    };

    // Only update parent if necessary
    if (setBleakExpanseState) {
      // Compare with previous state before updating to prevent unnecessary renders
      const timeoutId = setTimeout(() => {
        // Note: In a real app, you might want to use a proper deep comparison
        // or a library like lodash's isEqual for more complex objects
        setBleakExpanseState(prevState => {
          // Only update if something has actually changed
          if (JSON.stringify(prevState) === JSON.stringify(stateUpdate)) {
            return prevState; // Return previous state if nothing changed
          }
          return stateUpdate;
        });
      }, 50); // Small delay to batch updates
      
      return () => clearTimeout(timeoutId);
    }
  // Only include state values that should trigger parent updates
  // Explicitly exclude secondsRemaining to prevent constant updates
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedArea, isExploring, lastRewards, selectedSquad, 
      showSquadModal, lastCombatResult, expeditionEvents, activeEvent]);
  
  // Sync with global state when activeExplorationTask changes
  useEffect(() => {
    if (activeExplorationTask) {
      // Update selected area from global state
      setSelectedArea(activeExplorationTask.areaId);
      
      // Update squad from global state
      const squadMembers = playerMercenaries.filter(m => 
        activeExplorationTask.squadMercIds.includes(m.instanceId)
      );
      setSelectedSquad(squadMembers);
    }
  }, [activeExplorationTask, playerMercenaries]);
  
  // Sync expedition results when they appear in bleakExpanseState
  useEffect(() => {
    // Skip syncing if not initialized or no state to sync from
    if (!bleakExpanseState || !isInitialized.current) return;
    
    // Use functional updates to ensure we're working with the latest state
    if (bleakExpanseState.lastRewards && 
        bleakExpanseState.lastRewards.length > 0 && 
        JSON.stringify(lastRewards) !== JSON.stringify(bleakExpanseState.lastRewards)) {
      setLastRewards(bleakExpanseState.lastRewards);
    }
    
    if (bleakExpanseState.lastCombatResult && 
        JSON.stringify(lastCombatResult) !== JSON.stringify(bleakExpanseState.lastCombatResult)) {
      setLastCombatResult(bleakExpanseState.lastCombatResult);
    }
    
    if (bleakExpanseState.expeditionEvents && 
        bleakExpanseState.expeditionEvents.length > 0 && 
        JSON.stringify(expeditionEvents) !== JSON.stringify(bleakExpanseState.expeditionEvents)) {
      setExpeditionEvents(bleakExpanseState.expeditionEvents);
    }
    
    // Don't sync values that we manage locally and push to parent
    // This prevents circular updates
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bleakExpanseState]);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    forceComplete: () => {
      if (isExploring) {
        completeExploration();
      } else {
        console.log('No active expedition to force complete.');
      }
    }
  }));

  // Helper function to calculate total stats with equipment bonuses
  const calculateTotalStats = (merc) => {
    if (!merc) return { strength: 0, agility: 0, willpower: 0 };
    
    // Start with base stats
    const totalStats = { 
      strength: merc.stats.strength || 0, 
      agility: merc.stats.agility || 0, 
      willpower: merc.stats.willpower || 0 
    };
    
    // Add equipment bonuses if the mercenary has equipment
    if (merc.equipment) {
      Object.values(merc.equipment).forEach(item => {
        if (item && item.stats) {
          if (item.stats.strength) totalStats.strength += item.stats.strength;
          if (item.stats.agility) totalStats.agility += item.stats.agility;
          if (item.stats.willpower) totalStats.willpower += item.stats.willpower;
        }
      });
    }
    
    return totalStats;
  };

  // Areas available for exploration with their properties
  const explorationAreas = [
    {
      id: 'whispering-woods',
      name: 'Whispering Woods',
      description: 'A dense forest with ancient trees that seem to whisper ancient secrets.',
      icon: faTree,
      risk: 'Low',
      yields: 'Wood, Herbs, Vitae',
      color: '#2d4a22',
      duration: 300, // 5 minutes in seconds
    },
    {
      id: 'ruined-outpost',
      name: 'Ruined Outpost',
      description: 'Abandoned remnants of a military outpost, now home to scavengers and lost treasures.',
      icon: faTowerObservation,
      risk: 'Medium',
      yields: 'Ore, Crystals, Vitae',
      color: '#555555',
      duration: 600, // 10 minutes in seconds
    }
  ];

  // Loot tables for different areas (keeping locally for reference)
  const lootTables = {
    'whispering-woods': { 
      duration: 300, 
      enemyPower: 15, // Combat difficulty rating
      enemies: ['Feral Wolves', 'Corrupted Plants', 'Swamp Lurkers']
    },
    'ruined-outpost': { 
      duration: 600, 
      enemyPower: 30, // Combat difficulty rating
      enemies: ['Mire Goblins', 'Scavengers', 'Restless Spirits']
    }
  };

  // Function to handle area selection
  const handleSelectArea = (areaId) => {
    // If already exploring, don't allow area change
    if (isExploring) return;
    setSelectedArea(areaId);
  };

  // Function to begin an expedition
  const handleBeginExpedition = () => {
    // Only start if an area is selected, we have a squad, and we're not already exploring
    if (!selectedArea || isExploring || selectedSquad.length === 0) return;

    // Get the squad member IDs
    const squadMercIds = selectedSquad.map(merc => merc.instanceId);
    
    // Call the global startNewExploration function
    startNewExploration(selectedArea, squadMercIds);
  };

  // Function to close the results display
  const handleCloseResults = () => {
    setLastRewards(null);
  };

  // Function to toggle the squad selection modal
  const toggleSquadModal = () => {
    setShowSquadModal(!showSquadModal);
  };

  // Function to add a mercenary to the selected squad
  const addMercToSquad = (merc) => {
    // Check if squad already has this mercenary
    if (selectedSquad.some(m => m.instanceId === merc.instanceId)) return;
    
    // Check if mercenary HP is too low for expedition
    const MIN_HP_THRESHOLD = 10;
    if (merc.currentHP < MIN_HP_THRESHOLD) {
      // Do not add mercenary with low HP
      return;
    }
    
    // Add to squad (limit to 4 mercenaries max)
    if (selectedSquad.length < 4) {
      setSelectedSquad([...selectedSquad, merc]);
    }
  };

  // Function to remove a mercenary from the selected squad
  const removeMercFromSquad = (mercId) => {
    setSelectedSquad(selectedSquad.filter(merc => merc.instanceId !== mercId));
  };

  // Maximum squad size
  const MAX_SQUAD_SIZE = 4;

  // Format seconds to mm:ss display
  const formatTimeRemaining = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bleak-expanse-container">
      <h1 className="module-title">Bleak Expanse</h1>
      
      {/* Squad Selection Section */}
      <div className="squad-selection-section">
        <h2 className="section-title">Expedition Squad</h2>
        <div className="selected-squad-display">
          <div className="squad-count">Selected Squad ({selectedSquad.length} / {MAX_SQUAD_SIZE})</div>
          <div className="squad-members">
            {selectedSquad.map(merc => (
              <div 
                key={merc.instanceId} 
                className={`squad-member ${isExploring ? 'disabled' : ''}`}
                onClick={() => !isExploring && removeMercFromSquad(merc.instanceId)}
              >
                <div className="squad-member-icon">
                  {/* Icon would go here */}
                </div>
                <div className="squad-member-name">{merc.name}</div>
              </div>
            ))}
            {Array(MAX_SQUAD_SIZE - selectedSquad.length).fill().map((_, i) => (
              <div 
                key={i} 
                className={`empty-squad-slot ${isExploring ? 'disabled' : ''}`}
                onClick={() => !isExploring && toggleSquadModal()}
              >
                <div className="empty-slot-icon">+</div>
              </div>
            ))}
          </div>
          <button 
            className="edit-squad-button" 
            onClick={toggleSquadModal}
            disabled={isExploring}
          >
            {selectedSquad.length === 0 ? "Select Squad" : "Edit Squad"}
          </button>
          {selectedSquad.length > 0 && (
            <div className="squad-power">
              Total Squad Power: {Math.round(calculateSquadPower(selectedSquad))}
            </div>
          )}
        </div>
      </div>
      
      {/* Area Selection Section */}
      <div className="area-selection-section">
        <h2 className="section-title">Select an Area to Explore</h2>
        <div className="areas-grid">
          {explorationAreas.map((area) => (
            <div 
              key={area.id} 
              className={`area-card ${selectedArea === area.id ? 'selected' : ''} ${isExploring && selectedArea === area.id ? 'exploring' : ''}`}
              onClick={() => handleSelectArea(area.id)}
              style={{ 
                borderColor: area.color, 
                boxShadow: selectedArea === area.id ? `0 0 10px ${area.color}` : 'none'
              }}
            >
              <div className="area-icon" style={{ backgroundColor: area.color }}>
                <FontAwesomeIcon icon={area.icon} />
              </div>
              <div className="area-details">
                <h3 className="area-name">{area.name}</h3>
                <p className="area-description">{area.description}</p>
                <div className="area-meta">
                  <span className="area-risk">Risk: <span className="risk-level">{area.risk}</span></span>
                  <span className="area-yields">Yields: <span className="yields-list">{area.yields}</span></span>
                  <span className="area-time">Time: <span className="time-value">{formatTimeRemaining(lootTables[area.id].duration)}</span></span>
                  <span className="area-difficulty">Enemy Power: <span className="difficulty-value">{lootTables[area.id].enemyPower}</span></span>
                </div>
              </div>
              {selectedArea === area.id && isExploring && (
                <div className="area-progress-overlay">
                  <FontAwesomeIcon icon={faHourglass} className="exploring-icon" />
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${(1 - secondsRemaining / lootTables[area.id].duration) * 100}%`,
                        backgroundColor: area.color
                      }}
                    ></div>
                  </div>
                  <div className="time-remaining">{formatTimeRemaining(secondsRemaining)}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Dispatch & Status Section */}
      <div className="dispatch-section">
        <div className="status-display">
          {isExploring ? (
            <p>
              Expedition Underway: {explorationAreas.find(area => area.id === selectedArea)?.name} - 
              Time Remaining: {formatTimeRemaining(secondsRemaining)}
            </p>
          ) : (
            <p>
              {selectedArea 
                ? selectedSquad.length > 0 
                  ? 'Ready to begin expedition.' 
                  : 'Select a squad before beginning expedition.' 
                : 'Idle. Select an area to explore.'
              }
            </p>
          )}
        </div>
        <button 
          className="dispatch-button" 
          onClick={handleBeginExpedition}
          disabled={!selectedArea || isExploring || selectedSquad.length === 0}
        >
          <FontAwesomeIcon icon={faArrowRight} />
          Begin Expedition
        </button>
      </div>
      
      {/* Squad Selection Modal */}
      {showSquadModal && (
        <div className="squad-modal-overlay">
          <div className="squad-modal">
            <div className="squad-modal-header">
              <h2>Select Your Expedition Squad</h2>
              <button className="close-modal-button" onClick={toggleSquadModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="squad-modal-content">
              <div className="available-mercenaries">
                <h3>Available Mercenaries</h3>
                <div className="mercenary-list">
                  {((playerMercenaries || [])
                    .filter(merc => !((selectedSquad || []).some(sm => sm && merc && sm.instanceId === merc.instanceId)))
                    .map(merc => {
                      const totalStats = calculateTotalStats(merc);
                      // Check if mercenary HP is too low
                      const MIN_HP_THRESHOLD = 10;
                      const isHpTooLow = merc.currentHP < MIN_HP_THRESHOLD;
                      return (
                        <div 
                          key={merc?.instanceId || `merc-${Math.random()}`} 
                          className={`mercenary-card ${isHpTooLow ? 'injured' : ''}`}
                          onClick={() => merc && !isHpTooLow && addMercToSquad(merc)}
                        >
                          <div className="merc-name">{merc?.name || 'Unknown'}</div>
                          <div className="merc-level">Level {merc?.level || 1}</div>
                          <div className="merc-stats">
                            <span>STR: {totalStats.strength}</span>
                            <span>AGI: {totalStats.agility}</span>
                            <span>WILL: {totalStats.willpower}</span>
                          </div>
                          <div className="merc-san">SAN: {merc?.currentSAN || 0}/{merc?.maxSAN || 0}</div>
                          <div className={`merc-hp ${isHpTooLow ? 'low-hp' : ''}`}>
                            HP: {merc?.currentHP || 0}/{merc?.combatStats?.hp || 0}
                            {isHpTooLow && <span className="injury-warning"> (Too injured)</span>}
                          </div>
                        </div>
                      );
                    }))}
                </div>
              </div>
              
              <div className="selected-squad">
                <h3>Expedition Squad ({selectedSquad.length}/{MAX_SQUAD_SIZE})</h3>
                <div className="squad-slots">
                  {selectedSquad.map(merc => {
                    const totalStats = calculateTotalStats(merc);
                    const totalPower = Math.round((totalStats.strength + totalStats.agility) * (1 + (merc.level - 1) * 0.1));
                    
                    return (
                    <div 
                      key={merc.instanceId} 
                      className="squad-slot filled"
                      onClick={() => removeMercFromSquad(merc.instanceId)}
                    >
                      <div className="slot-merc-name">{merc.name}</div>
                      <div className="slot-merc-level">Level {merc.level}</div>
                      <div className="slot-merc-power">Power: {totalPower}</div>
                      <div className="slot-merc-hp">HP: {merc.currentHP}/{merc.combatStats.hp}</div>
                      <div className="remove-from-squad">✕</div>
                    </div>
                    );
                  })}
                  {Array(MAX_SQUAD_SIZE - selectedSquad.length).fill().map((_, i) => (
                    <div key={i} className="squad-slot empty">
                      <div className="empty-slot-text">Empty Slot</div>
                    </div>
                  ))}
                </div>
                
                <div className="squad-total-power">
                  Total Squad Power: {Math.round(calculateSquadPower(selectedSquad))}
                </div>
                
                <button 
                  className="confirm-squad-button"
                  onClick={toggleSquadModal}
                >
                  Confirm Squad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Results Modal */}
      {lastRewards && lastRewards.length > 0 && (
        <div className="results-modal-overlay">
          <div className="results-modal">
            <button className="close-results-button" onClick={handleCloseResults}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="results-title">Expedition Results</h2>
            
            {/* Expedition Summary */}
            <div className="expedition-summary">
              <h3>Expedition Summary</h3>
              <ul className="event-list">
                {expeditionEvents.map((event, index) => (
                  <li key={index} className="event-item">{event}</li>
                ))}
              </ul>
            </div>
            
            {/* Combat Outcome */}
            {lastCombatResult && (
              <div className={`combat-outcome ${lastCombatResult.outcome.toLowerCase()}`}>
                <h3>Combat Result: {lastCombatResult.outcome}</h3>
                <p>Encountered {lastCombatResult.enemyType}</p>
                <div className="combat-details">
                  <div>Your Squad: {lastCombatResult.squadPower}</div>
                  <div>Enemy Force: {lastCombatResult.enemyPower}</div>
                  <div>
                    Margin: {lastCombatResult.combatMargin > 0 ? '+' : ''}{lastCombatResult.combatMargin}
                  </div>
                </div>
              </div>
            )}
            
            <p className="results-subtitle">
              Your expedition to {explorationAreas.find(area => area.id === selectedArea)?.name} has returned with:
            </p>
            <div className="rewards-list">
              {lastRewards.map((reward, index) => (
                <div key={index} className="reward-item">
                  <div className="reward-icon">
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </div>
                  <div className="reward-details">
                    <span className="reward-name">
                      {reward.name || 
                       (reward.id === 'gold' ? 'Gold' : 
                        reward.id === 'vitae_essence' ? 'Vitae Essence' : 
                        reward.id === 'behelit_shard' ? 'Behelit Shard' : 
                        reward.id === 'echoes' ? 'Echoes' : reward.id)}
                    </span>
                    <span className="reward-quantity">x{reward.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="claim-button" onClick={handleCloseResults}>
              Claim Rewards
            </button>
          </div>
        </div>
      )}
      
      {/* Exploration Event Modal - Remove if event handling is moved to global state */}
      {activeEvent && (
        <div>
          <ExplorationEventModal 
            event={activeEvent}
            onChoiceSelected={() => setActiveEvent(null)}
            onCloseEvent={() => setActiveEvent(null)}
          />
        </div>
      )}
    </div>
  );
});

export default BleakExpanse; 