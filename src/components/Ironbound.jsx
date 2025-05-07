import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserShield, faUserSecret, faHatWizard, 
  faQuestion, faCircle, faHeart, 
  faFistRaised, faRunning, faBrain,
  faShieldAlt, faTshirt, faRing, faGem,
  faInfoCircle, faTimes, faArrowCircleRight, faArrowCircleLeft
} from '@fortawesome/free-solid-svg-icons';
import './Ironbound.css';

// Ironbound component - manages the mercenary roster and interactions
const Ironbound = ({ 
  playerMercenaries,
  stashItems,
  gold,
  updateMercenary,
  updateResource,
  removeItemsFromStash,
  addItemsToStash,
  selectedMercId,
  setSelectedMercId
}) => {
  // Local state
  const [showSkillInfo, setShowSkillInfo] = useState(null);
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  // Updated tooltip state object with style property
  const [tooltipState, setTooltipState] = useState({
    isVisible: false,
    content: null,
    style: {
      top: '0px',
      left: '0px',
      position: 'fixed',
      zIndex: 9999
    }
  });
  
  // Find the selected mercenary object (with null checking)
  const selectedMerc = (playerMercenaries || []).find(m => m?.instanceId === selectedMercId);
  
  // Get icon component for mercenary based on icon name
  const getMercenaryIcon = (iconName) => {
    switch(iconName) {
      case 'faUserShield': return faUserShield;
      case 'faUserSecret': return faUserSecret;
      case 'faHatWizard': return faHatWizard;
      default: return faQuestion;
    }
  };
  
  // Get SAN status color based on percentage
  const getSanStatusColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage < 30) return '#ff3333'; // Red
    if (percentage < 70) return '#ffcc00'; // Yellow
    return '#66cc33'; // Green
  };
  
  // Get HP status color based on percentage
  const getHpStatusColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage < 25) return '#ff0000'; // Bright Red
    if (percentage < 50) return '#ff4500'; // OrangeRed
    if (percentage < 75) return '#ffa500'; // Orange
    return '#00cc00'; // Green
  };
  
  // Calculate XP to next level
  const getXpToNextLevel = (level) => {
    return level * 100; // Simple formula: level * 100
  };
  
  // Get skill descriptions
  const getSkillDescription = (skillName) => {
    const skillDescriptions = {
      'Heavy Swing': 'A powerful but slow melee attack that deals significant damage to a single target.',
      'Endure Pain': 'Reduces incoming damage for a short period, allowing the mercenary to withstand powerful blows.',
      'Quick Stab': 'A fast, precise strike that has a chance to hit vital points, causing bleeding damage over time.',
      'Fade': 'The mercenary becomes harder to detect, reducing the chance of being targeted by enemies.',
      'Mana Bolt': 'Channels magical energy into a damaging projectile that can hit targets from a distance.',
      'Minor Ward': 'Creates a magical barrier that absorbs a small amount of damage before breaking.'
    };
    
    return skillDescriptions[skillName] || 'No description available for this skill.';
  };
  
  // Handle level up
  const handleLevelUp = () => {
    if (!selectedMerc) return;
    
    const currentLevel = selectedMerc.level;
    const currentXp = selectedMerc.xp;
    const requiredXp = getXpToNextLevel(currentLevel);
    
    if (currentXp >= requiredXp) {
      // Random stat increases
      const strengthIncrease = Math.floor(Math.random() * 2) + 1; // 1-2
      const agilityIncrease = Math.floor(Math.random() * 2) + 1; // 1-2
      const willpowerIncrease = Math.floor(Math.random() * 2) + 1; // 1-2
      const sanIncrease = Math.floor(Math.random() * 10) + 5; // 5-14
      
      // Update mercenary
      updateMercenary(selectedMercId, {
        level: currentLevel + 1,
        xp: currentXp - requiredXp,
        maxSAN: selectedMerc.maxSAN + sanIncrease,
        currentSAN: selectedMerc.currentSAN + sanIncrease, // Heal on level up
        stats: {
          ...selectedMerc.stats,
          strength: selectedMerc.stats.strength + strengthIncrease,
          agility: selectedMerc.stats.agility + agilityIncrease,
          willpower: selectedMerc.stats.willpower + willpowerIncrease
        }
      });
    }
  };
  
  // Handle rest action
  const handleRest = () => {
    if (selectedMerc) {
      const restGoldCost = 10;
      const herbsRequired = 5;
      
      // Check if player has enough resources
      const hasEnoughGold = gold >= restGoldCost;
      const herbItem = (stashItems || []).find(item => item.id === 'herbs');
      const hasEnoughHerbs = herbItem && herbItem.quantity >= herbsRequired;
      
      if (hasEnoughGold && hasEnoughHerbs) {
        // Deduct resources
        updateResource('gold', -restGoldCost);
        removeItemsFromStash([{ id: 'herbs', quantity: herbsRequired }]);
        
        // Restore SAN (10 points)
        const sanGain = 10;
        const newSAN = Math.min(selectedMerc.maxSAN, selectedMerc.currentSAN + sanGain);
        
        // Restore HP (20% of max HP)
        const hpGain = Math.ceil(selectedMerc.combatStats.hp * 0.2);
        const newHP = Math.min(selectedMerc.combatStats.hp, selectedMerc.currentHP + hpGain);
        
        // Update mercenary
        updateMercenary(selectedMercId, {
          currentSAN: newSAN,
          currentHP: newHP
        });
      }
    }
  };
  
  // Check if rest is affordable
  const isRestAffordable = () => {
    if (!selectedMerc) return false;
    
    const restGoldCost = 10;
    const herbsRequired = 5;
    
    const hasEnoughGold = gold >= restGoldCost;
    const herbItem = (stashItems || []).find(item => item.id === 'herbs');
    const hasEnoughHerbs = herbItem && herbItem.quantity >= herbsRequired;
    
    return hasEnoughGold && hasEnoughHerbs;
  };
  
  // Handle equipment slot click - Show modal with filtered items
  const handleEquipmentClick = (slot) => {
    if (!selectedMerc) return;
    
    // Set the selected slot and show the equipment modal
    setSelectedSlot(slot);
    setShowEquipModal(true);
  };
  
  // Handle equipping an item
  const handleEquipItem = (item) => {
    if (!selectedMerc || !selectedSlot) return;
    
    // Get current equipment
    const currentEquipment = selectedMerc.equipment[selectedSlot];
    
    // Update mercenary equipment
    updateMercenary(selectedMercId, {
      equipment: {
        ...selectedMerc.equipment,
        [selectedSlot]: item
      }
    });
    
    // Remove item from stash
    if (item.instanceId) {
      // Remove by instanceId for unique equipment
      removeItemsFromStash([{ instanceId: item.instanceId, quantity: 1 }]);
    } else {
      // Remove by id and quantity for stackable items (fallback)
      removeItemsFromStash([{ id: item.id, quantity: 1 }]);
    }
    
    // If an item was already equipped, add it back to stash
    if (currentEquipment) {
      addItemsToStash([currentEquipment]);
    }
    
    // Close the modal
    setShowEquipModal(false);
  };
  
  // Handle unequipping an item
  const handleUnequipItem = (slot) => {
    if (!selectedMerc) return;
    
    // Get the currently equipped item
    const equippedItem = selectedMerc.equipment[slot];
    
    if (equippedItem) {
      // Update mercenary equipment (set slot to null)
      updateMercenary(selectedMercId, {
        equipment: {
          ...selectedMerc.equipment,
          [slot]: null
        }
      });
      
      // Add the unequipped item back to stash
      // Special handling for items without proper equipment attributes
      if (equippedItem.id === 'rusty_dagger' && !equippedItem.instanceId) {
        // Add complete item with all properties needed for tooltip display
        addItemsToStash([{ 
          id: 'rusty_dagger', 
          name: 'Rusty Dagger', 
          quantity: 1, 
          icon: '🗡️', 
          type: 'Weapon',
          subType: 'Dagger',
          description: 'A simple dagger with a rusty blade. Not very effective, but better than nothing.',
          quality: 'Common',
          stats: {
            strength: { base: 2 },
            agility: { base: 1 }
          },
          value: 25
        }]);
      } else if (equippedItem.id === 'torn_cloak' && !equippedItem.instanceId) {
        // Add complete item definition for Torn Cloak
        addItemsToStash([{ 
          id: 'torn_cloak', 
          name: 'Torn Cloak', 
          quantity: 1, 
          icon: '👘', 
          type: 'Armor',
          subType: 'Chest',
          description: 'A ragged cloak offering minimal protection.',
          quality: 'Tattered',
          stats: {
            agility: { base: 1 }
          },
          value: 15
        }]);
      } else {
        // Add back as normal for regular equipment
        addItemsToStash([equippedItem]);
      }
      
      console.log("Unequipped item:", equippedItem);
    }
  };
  
  // UPDATED: Handle hovering over equipment with improved tooltip positioning
  const handleEquipmentHover = (e, item) => {
    // Get a direct reference to the DOM element being hovered
    const hoveredSlotElement = e.currentTarget;
    
    // Get the element's position relative to the viewport
    const slotRect = hoveredSlotElement.getBoundingClientRect();
    
    // Calculate tooltip position (to the right of the slot with a 10px offset)
    const tooltipTopPosition = slotRect.top + window.scrollY; // Add scrollY for correct page offset
    const tooltipLeftPosition = slotRect.right + window.scrollX + 10; // 10px offset to the right
    
    // Update tooltip state with all necessary properties
    setTooltipState({
      isVisible: true,
      content: item,
      style: {
        top: `${tooltipTopPosition}px`,
        left: `${tooltipLeftPosition}px`,
        position: 'fixed',
        zIndex: 9999
      }
    });
    
    console.log("HOVER EVENT", {
      target: hoveredSlotElement.textContent,
      rect: slotRect,
      tooltipPosition: {
        top: tooltipTopPosition,
        left: tooltipLeftPosition
      }
    });
  };
  
  // UPDATED: Handle mouse leave to hide tooltip
  const handleEquipmentLeave = () => {
    setTooltipState(prev => ({
      ...prev,
      isVisible: false
    }));
  };
  
  // Filter stash items by slot type
  const getFilteredStashItems = () => {
    if (!selectedSlot) return [];
    
    // Define slot type requirements
    const slotTypeMap = {
      weapon: { type: 'Weapon' },
      armor: { type: 'Armor' },
      accessory1: { type: 'Accessory' },
      accessory2: { type: 'Accessory' }
    };
    
    const slotRequirement = slotTypeMap[selectedSlot];
    
    if (!slotRequirement) return [];
    
    // Return filtered items that match the slot type
    return (stashItems || []).filter(item => {
      // Only show items that match the required type
      return item.type === slotRequirement.type;
    });
  };
  
  // Calculate total stats including equipment bonuses
  const calculateTotalStats = (mercenary) => {
    if (!mercenary || !mercenary.stats) return { strength: 0, agility: 0, willpower: 0 };
    
    // Start with base stats
    const totalStats = { ...mercenary.stats };
    
    // Equipment slots to check
    const slots = ['weapon', 'armor', 'accessory1', 'accessory2'];
    
    // Add bonuses from each equipped item
    slots.forEach(slot => {
      const item = mercenary.equipment && mercenary.equipment[slot];
      if (item && item.stats) {
        // For each stat in the item
        Object.keys(item.stats).forEach(statName => {
          if (!totalStats[statName]) {
            totalStats[statName] = 0;
          }
          // Add the stat bonus (handling both flat values and objects with base property)
          const statBonus = typeof item.stats[statName] === 'object' 
            ? item.stats[statName].base 
            : item.stats[statName];
          
          totalStats[statName] += statBonus || 0;
        });
      }
    });
    
    return totalStats;
  };
  
  // Calculate stat bonuses from equipment only
  const calculateEquipmentBonuses = (mercenary) => {
    if (!mercenary || !mercenary.equipment) return {};
    
    // Initialize bonuses object
    const bonuses = {};
    
    // Equipment slots to check
    const slots = ['weapon', 'armor', 'accessory1', 'accessory2'];
    
    // Add bonuses from each equipped item
    slots.forEach(slot => {
      const item = mercenary.equipment[slot];
      if (item && item.stats) {
        // For each stat in the item
        Object.keys(item.stats).forEach(statName => {
          if (!bonuses[statName]) {
            bonuses[statName] = 0;
          }
          // Add the stat bonus (handling both flat values and objects with base property)
          const statBonus = typeof item.stats[statName] === 'object' 
            ? item.stats[statName].base 
            : item.stats[statName];
          
          bonuses[statName] += statBonus || 0;
        });
      }
    });
    
    return bonuses;
  };
  
  // Get equipment icon based on type
  const getEquipmentIcon = (item) => {
    if (!item) return faQuestion;
    
    switch(item.type) {
      case 'Weapon': return faShieldAlt;
      case 'Armor': return faTshirt;
      case 'Accessory': return item.subType === 'Ring' ? faRing : faGem;
      default: return faQuestion;
    }
  };
  
  // Compute calculated stats if a mercenary is selected
  const equipmentBonuses = selectedMerc ? calculateEquipmentBonuses(selectedMerc) : {};
  const totalStats = selectedMerc ? calculateTotalStats(selectedMerc) : {};
  
  return (
    <div className="ironbound-container">
      <h1 className="ironbound-title">Ironbound Covenant</h1>
      
      <div className="ironbound-layout">
        {/* Left panel - Mercenary roster list */}
        <div className="mercenary-roster-panel">
          <h2 className="panel-title">Roster</h2>
          
          {(playerMercenaries || []).length > 0 ? (
            <ul className="mercenary-list">
              {(playerMercenaries || []).map(merc => (
                <li 
                  key={merc.instanceId} 
                  className={`mercenary-list-item ${selectedMercId === merc.instanceId ? 'selected' : ''}`}
                  onClick={() => setSelectedMercId(merc.instanceId)}
                >
                  <div className="merc-list-icon">
                    <FontAwesomeIcon icon={getMercenaryIcon(merc.icon)} />
                  </div>
                  <div className="merc-list-info">
                    <div className="merc-list-name">{merc.name}</div>
                    <div className="merc-list-details">
                      <span className="merc-list-level">Lvl {merc.level}</span>
                      <span className="merc-list-job">{merc.job}</span>
                      <span className="merc-list-san">
                        <FontAwesomeIcon 
                          icon={faCircle} 
                          style={{ color: getSanStatusColor(merc.currentSAN, merc.maxSAN) }}
                        />
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-roster-message">No souls bound to your service.</p>
          )}
        </div>
        
        {/* Right panel - Selected mercenary details */}
        <div className="mercenary-details-panel">
          {selectedMerc ? (
            <div className="mercenary-details">
              {/* Header */}
              <div className="merc-header">
                <div className="merc-icon">
                  <FontAwesomeIcon icon={getMercenaryIcon(selectedMerc.icon)} size="3x" />
                </div>
                <div className="merc-header-info">
                  <h2 className="merc-name">{selectedMerc.name}</h2>
                  <div className="merc-title">
                    Level {selectedMerc.level} {selectedMerc.job}
                  </div>
                </div>
              </div>
              
              {/* XP Bar */}
              <div className="stat-section">
                <div className="stat-header">
                  <span className="stat-label">Experience</span>
                  <span className="stat-value">
                    {selectedMerc.xp} / {getXpToNextLevel(selectedMerc.level)}
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar xp-bar"
                    style={{ 
                      width: `${Math.min(100, (selectedMerc.xp / getXpToNextLevel(selectedMerc.level)) * 100)}%` 
                    }}
                  ></div>
                </div>
                
                {/* Level Up Button */}
                {selectedMerc.xp >= getXpToNextLevel(selectedMerc.level) && (
                  <button 
                    className="level-up-button" 
                    onClick={handleLevelUp}
                  >
                    Level Up
                  </button>
                )}
              </div>
              
              {/* SAN Bar */}
              <div className="stat-section">
                <div className="stat-header">
                  <span className="stat-label">
                    Sanity (SAN)
                    <span className="tooltip-container">
                      <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                      <span className="tooltip-text">
                        Low SAN increases instability and risk of negative outcomes during missions.
                      </span>
                    </span>
                  </span>
                  <span className="stat-value">
                    {selectedMerc.currentSAN} / {selectedMerc.maxSAN}
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar san-bar"
                    style={{ 
                      width: `${(selectedMerc.currentSAN / selectedMerc.maxSAN) * 100}%`,
                      backgroundColor: getSanStatusColor(selectedMerc.currentSAN, selectedMerc.maxSAN)
                    }}
                  ></div>
                </div>
              </div>
              
              {/* HP Bar */}
              <div className="stat-section">
                <div className="stat-header">
                  <span className="stat-label">
                    Health (HP)
                    <span className="tooltip-container">
                      <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                      <span className="tooltip-text">
                        HP represents physical health. When HP reaches 0, the mercenary is incapacitated.
                      </span>
                    </span>
                  </span>
                  <span className="stat-value">
                    {selectedMerc.currentHP} / {selectedMerc.combatStats.hp}
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar hp-bar"
                    style={{ 
                      width: `${(selectedMerc.currentHP / selectedMerc.combatStats.hp) * 100}%`,
                      backgroundColor: getHpStatusColor(selectedMerc.currentHP, selectedMerc.combatStats.hp)
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Core Stats - Updated to show base + equipment bonuses */}
              <div className="stats-grid">
                <div className="stat-item">
                  <FontAwesomeIcon icon={faFistRaised} className="stat-icon" />
                  <div className="stat-details">
                    <span className="stat-name">Strength</span>
                    <span className="stat-number">
                      {selectedMerc.stats.strength}
                      {equipmentBonuses.strength ? (
                        <span className="equipment-bonus">
                          {" + "}{equipmentBonuses.strength}{" = "}{totalStats.strength}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </div>
                <div className="stat-item">
                  <FontAwesomeIcon icon={faRunning} className="stat-icon" />
                  <div className="stat-details">
                    <span className="stat-name">Agility</span>
                    <span className="stat-number">
                      {selectedMerc.stats.agility}
                      {equipmentBonuses.agility ? (
                        <span className="equipment-bonus">
                          {" + "}{equipmentBonuses.agility}{" = "}{totalStats.agility}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </div>
                <div className="stat-item">
                  <FontAwesomeIcon icon={faBrain} className="stat-icon" />
                  <div className="stat-details">
                    <span className="stat-name">Willpower</span>
                    <span className="stat-number">
                      {selectedMerc.stats.willpower}
                      {equipmentBonuses.willpower ? (
                        <span className="equipment-bonus">
                          {" + "}{equipmentBonuses.willpower}{" = "}{totalStats.willpower}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="section-title">Skills</div>
              <ul className="skills-list">
                {selectedMerc.skills.length > 0 ? (
                  selectedMerc.skills.map((skill, index) => (
                    <li key={index} className="skill-item">
                      <span 
                        className="skill-name"
                        onClick={() => setShowSkillInfo(showSkillInfo === skill ? null : skill)}
                      >
                        {skill}
                      </span>
                      {showSkillInfo === skill && (
                        <div className="skill-description">
                          {getSkillDescription(skill)}
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="skill-item empty">No skills known</li>
                )}
              </ul>
              
              {/* Equipment - Enhanced with hover tooltips and unequip functionality */}
              <div className="section-title">Equipment</div>
              <div className="equipment-grid">
                <div 
                  className={`equipment-slot ${!selectedMerc.equipment.weapon ? 'empty' : ''}`}
                  onClick={() => handleEquipmentClick('weapon')}
                  onMouseEnter={(e) => selectedMerc.equipment.weapon && handleEquipmentHover(e, selectedMerc.equipment.weapon)}
                  onMouseLeave={handleEquipmentLeave}
                >
                  {selectedMerc.equipment.weapon ? (
                    <div className="equipment-item">
                      <FontAwesomeIcon 
                        icon={getEquipmentIcon(selectedMerc.equipment.weapon)} 
                        className="equipment-icon" 
                      />
                      <span className="equipment-name">{selectedMerc.equipment.weapon.name}</span>
                    </div>
                  ) : (
                    <div className="empty-slot">
                      <span className="slot-name">Weapon</span>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`equipment-slot ${!selectedMerc.equipment.armor ? 'empty' : ''}`}
                  onClick={() => handleEquipmentClick('armor')}
                  onMouseEnter={(e) => selectedMerc.equipment.armor && handleEquipmentHover(e, selectedMerc.equipment.armor)}
                  onMouseLeave={handleEquipmentLeave}
                >
                  {selectedMerc.equipment.armor ? (
                    <div className="equipment-item">
                      <FontAwesomeIcon 
                        icon={getEquipmentIcon(selectedMerc.equipment.armor)} 
                        className="equipment-icon" 
                      />
                      <span className="equipment-name">{selectedMerc.equipment.armor.name}</span>
                    </div>
                  ) : (
                    <div className="empty-slot">
                      <span className="slot-name">Armor</span>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`equipment-slot ${!selectedMerc.equipment.accessory1 ? 'empty' : ''}`}
                  onClick={() => handleEquipmentClick('accessory1')}
                  onMouseEnter={(e) => selectedMerc.equipment.accessory1 && handleEquipmentHover(e, selectedMerc.equipment.accessory1)}
                  onMouseLeave={handleEquipmentLeave}
                >
                  {selectedMerc.equipment.accessory1 ? (
                    <div className="equipment-item">
                      <FontAwesomeIcon 
                        icon={getEquipmentIcon(selectedMerc.equipment.accessory1)} 
                        className="equipment-icon" 
                      />
                      <span className="equipment-name">{selectedMerc.equipment.accessory1.name}</span>
                    </div>
                  ) : (
                    <div className="empty-slot">
                      <span className="slot-name">Accessory 1</span>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`equipment-slot ${!selectedMerc.equipment.accessory2 ? 'empty' : ''}`}
                  onClick={() => handleEquipmentClick('accessory2')}
                  onMouseEnter={(e) => selectedMerc.equipment.accessory2 && handleEquipmentHover(e, selectedMerc.equipment.accessory2)}
                  onMouseLeave={handleEquipmentLeave}
                >
                  {selectedMerc.equipment.accessory2 ? (
                    <div className="equipment-item">
                      <FontAwesomeIcon 
                        icon={getEquipmentIcon(selectedMerc.equipment.accessory2)} 
                        className="equipment-icon" 
                      />
                      <span className="equipment-name">{selectedMerc.equipment.accessory2.name}</span>
                    </div>
                  ) : (
                    <div className="empty-slot">
                      <span className="slot-name">Accessory 2</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="section-title">Actions</div>
              <div className="actions-container">
                <button 
                  className="action-button rest-button"
                  onClick={handleRest}
                  disabled={!isRestAffordable()}
                >
                  <FontAwesomeIcon icon={faHeart} className="action-icon" />
                  <span className="action-name">Rest (10 Gold, 5 Herbs)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="no-selection-placeholder">
              <p>Select a soul from the Covenant to view details...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Equipment Modal */}
      {showEquipModal && selectedSlot && (
        <div className="equipment-modal-overlay" onClick={() => setShowEquipModal(false)}>
          <div className="equipment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select {selectedSlot.charAt(0).toUpperCase() + selectedSlot.slice(1)}</h3>
              <button className="close-modal-btn" onClick={() => setShowEquipModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            {/* Equipment currently in this slot */}
            {selectedMerc.equipment[selectedSlot] && (
              <div className="current-equipment">
                <h4>Currently Equipped</h4>
                <div className="equipped-item-display">
                  <FontAwesomeIcon 
                    icon={getEquipmentIcon(selectedMerc.equipment[selectedSlot])} 
                    className="equipment-icon" 
                  />
                  <span className="equipment-name">{selectedMerc.equipment[selectedSlot].name}</span>
                  <button 
                    className="unequip-button"
                    onClick={() => handleUnequipItem(selectedSlot)}
                  >
                    <FontAwesomeIcon icon={faArrowCircleLeft} /> Unequip
                  </button>
                </div>
              </div>
            )}
            
            {/* Filtered stash items */}
            <div className="filtered-stash-items">
              <h4>Available Items</h4>
              <div className="stash-items-grid">
                {getFilteredStashItems().length > 0 ? (
                  getFilteredStashItems().map((item, index) => (
                    <div 
                      key={index} 
                      className="stash-item"
                      onClick={() => handleEquipItem(item)}
                      onMouseEnter={(e) => handleEquipmentHover(e, item)}
                      onMouseLeave={handleEquipmentLeave}
                    >
                      <FontAwesomeIcon 
                        icon={getEquipmentIcon(item)} 
                        className="item-icon" 
                      />
                      <div className="stash-item-details">
                        <span className="item-name">{item.name}</span>
                        {item.quality && (
                          <span className="item-quality">{item.quality}</span>
                        )}
                      </div>
                      <button className="equip-button">
                        <FontAwesomeIcon icon={faArrowCircleRight} /> Equip
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-items-message">
                    No compatible items found in your stash.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* UPDATED: Equipment Tooltip with proper positioning */}
      {tooltipState.isVisible && tooltipState.content && (
        <div 
          id="equipment-tooltip"
          className="equipment-tooltip" 
          style={tooltipState.style}
        >
          <h4 className="tooltip-title">{tooltipState.content.name}</h4>
          {tooltipState.content.quality && (
            <div className="tooltip-quality">{tooltipState.content.quality}</div>
          )}
          <div className="tooltip-type">
            {tooltipState.content.type}
            {tooltipState.content.subType ? ` (${tooltipState.content.subType})` : ''}
          </div>
          {tooltipState.content.description && (
            <div className="tooltip-description">{tooltipState.content.description}</div>
          )}
          {tooltipState.content.stats && (
            <div className="tooltip-stats">
              <h5>Stats:</h5>
              <ul className="tooltip-stats-list">
                {Object.keys(tooltipState.content.stats).map((statName, idx) => {
                  const statValue = typeof tooltipState.content.stats[statName] === 'object'
                    ? tooltipState.content.stats[statName].base
                    : tooltipState.content.stats[statName];
                  
                  // Only show stats with non-zero values
                  if (statValue === 0) return null;
                  
                  // Get appropriate icon for the stat
                  let statIcon;
                  switch(statName) {
                    case 'strength': statIcon = faFistRaised; break;
                    case 'agility': statIcon = faRunning; break;
                    case 'willpower': statIcon = faBrain; break;
                    default: statIcon = faQuestion;
                  }
                  
                  return (
                    <li key={idx} className="tooltip-stat-item">
                      <FontAwesomeIcon icon={statIcon} className="tooltip-stat-icon" />
                      <span className="tooltip-stat-name">
                        {statName.charAt(0).toUpperCase() + statName.slice(1)}:
                      </span> 
                      <span className={statValue >= 0 ? 'positive-stat' : 'negative-stat'}>
                        {statValue >= 0 ? '+' : ''}{statValue}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Ironbound; 