import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDroplet, faWind, faShield, faCircleNotch, faPrayingHands, 
  faStar, faBurst, faHourglass, faQuestionCircle, 
  faFilter, faDice, faScroll, faGem, faHammer, faFlask, faCoins
} from '@fortawesome/free-solid-svg-icons';
import ItemDetailModal from './ItemDetailModal';
import './StashView.css';

// StashView component - Displays the player's inventory/stash with V2.0 enhancements
const StashView = ({ stashItems, addItemsToStash }) => {
  // State for tooltip display
  const [tooltipInfo, setTooltipInfo] = useState({
    visible: false,
    item: null,
    position: { x: 0, y: 0 }
  });

  // State for category filtering
  const [activeCategory, setActiveCategory] = useState('All');

  // State for detailed item modal
  const [detailedItem, setDetailedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get all unique item types to dynamically generate category tabs
  const categories = ['All', ...new Set(stashItems.map(item => item.type))];

  // Map string icon names to actual FontAwesome icons
  const getIconByName = (iconName) => {
    switch(iconName) {
      case 'faTree': return faWind;
      case 'faLeaf': return faWind;
      case 'faGem': return faDroplet;
      case 'faSeedling': return faBurst;
      case 'faMagic': return faStar;
      case 'faSparkles': return faStar;
      case 'faChessRook': return faHourglass;
      case 'faCrown': return faCircleNotch;
      case 'faSwords': return faShield;
      case 'faSword': return faShield;
      case 'faHatWizard': return faPrayingHands;
      case 'faShirt': return faPrayingHands;
      case 'faTshirt': return faPrayingHands;
      case 'faVial': return faDroplet;
      case 'faFlask': return faDroplet;
      default: return faQuestionCircle;
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Material': return faGem;
      case 'Weapon': return faHammer;
      case 'Armor': return faShield;
      case 'Accessory': return faGem;
      case 'Consumable': return faFlask;
      case 'Quest': return faScroll;
      case 'Currency': return faCoins;
      case 'All': return faFilter;
      default: return faDice;
    }
  };

  // Handle mouse enter on an inventory slot
  const handleItemMouseEnter = (event, item) => {
    // Get position for tooltip
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipInfo({
      visible: true,
      item: item,
      position: {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY
      }
    });
  };

  // Handle mouse leave from an inventory slot
  const handleItemMouseLeave = () => {
    setTooltipInfo({
      ...tooltipInfo,
      visible: false
    });
  };

  // Handle click on an item to show detailed modal
  const handleItemClick = (item) => {
    setDetailedItem(item);
    setShowModal(true);
  };

  // Handle closing the detail modal
  const handleCloseModal = () => {
    setShowModal(false);
    setDetailedItem(null);
  };

  // Handle split stack functionality
  const handleSplitStack = (item, splitQuantity) => {
    if (!item || splitQuantity <= 0 || splitQuantity >= item.quantity) return;

    // Create a new instance of the split item
    const splitItem = {
      ...item,
      quantity: splitQuantity
    };

    // Create updated original item with reduced quantity
    const updatedOriginalItem = {
      ...item,
      quantity: item.quantity - splitQuantity
    };

    // Add both the updated original item and the split item to the stash
    // The addItemsToStash function should handle updating existing items
    addItemsToStash([splitItem, updatedOriginalItem]);

    // Close the modal
    handleCloseModal();
  };

  // Filter items based on active category
  const filteredItems = activeCategory === 'All' 
    ? stashItems 
    : stashItems.filter(item => item.type === activeCategory);

  // Separate material items and other items
  const materialItems = filteredItems.filter(item => item.type === 'Material');
  const equipmentItems = filteredItems.filter(item => item.type !== 'Material');

  return (
    <div className="stash-view">
      <h2 className="module-title">Stash</h2>
      
      {/* Category tabs */}
      <div className="category-tabs">
        {categories.map(category => (
          <button 
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            <FontAwesomeIcon icon={getCategoryIcon(category)} className="category-icon" />
            <span>{category}</span>
          </button>
        ))}
      </div>
      
      {/* Secondary resources/materials section */}
      {materialItems.length > 0 && (
        <div className="secondary-resources-container">
          <h3 className="sub-section-title">Materials</h3>
          <div className="secondary-resources-grid">
            {materialItems.map((item, index) => (
              <div 
                key={index} 
                className="secondary-resource-item"
                onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                onMouseLeave={handleItemMouseLeave}
                onClick={() => handleItemClick(item)}
              >
                <FontAwesomeIcon 
                  icon={getIconByName(item.icon)} 
                  style={{ color: item.color }}
                  className="secondary-resource-icon"
                />
                <div className="secondary-resource-details">
                  <span className="secondary-resource-name">{item.name}</span>
                  <span className="secondary-resource-amount">{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Inventory slots section */}
      {equipmentItems.length > 0 && (
        <div className="stash-container">
          <h3 className="sub-section-title">Inventory</h3>
          
          <div className="stash-grid">
            {/* Mapping actual items to inventory slots */}
            {equipmentItems.map((item, index) => (
              <div
                key={index}
                className="stash-slot filled"
                onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                onMouseLeave={handleItemMouseLeave}
                onClick={() => handleItemClick(item)}
              >
                <div className="slot-inner">
                  <div className="inventory-item">
                    <FontAwesomeIcon 
                      icon={getIconByName(item.icon)} 
                      style={{ color: item.color }}
                      className="item-icon" 
                    />
                    {item.quantity > 1 && (
                      <span className="item-count">{item.quantity}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add empty slots to fill out the grid */}
            {Array(Math.max(0, 20 - equipmentItems.length)).fill(null).map((_, index) => (
              <div key={`empty-${index}`} className="stash-slot empty">
                <div className="slot-inner"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "No items" message when category is empty */}
      {filteredItems.length === 0 && (
        <div className="empty-category-message">
          <p>No {activeCategory === 'All' ? 'items' : activeCategory.toLowerCase() + 's'} in stash.</p>
        </div>
      )}
      
      {/* Tooltip that follows cursor */}
      {tooltipInfo.visible && tooltipInfo.item && (
        <div 
          className="item-tooltip"
          style={{
            top: `calc(${tooltipInfo.position.y}px - 60px)`,
            left: `calc(${tooltipInfo.position.x}px + 40px)`,
          }}
        >
          <div className="tooltip-header">
            <span className="tooltip-name">{tooltipInfo.item.name}</span>
            <span className="tooltip-type">{tooltipInfo.item.type}</span>
          </div>
          <div className="tooltip-content">
            <span className="tooltip-quantity">Quantity: {tooltipInfo.item.quantity}</span>
            {tooltipInfo.item.description && (
              <p className="tooltip-description">{tooltipInfo.item.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Use the ItemDetailModal component for detailed item view and splitting */}
      {showModal && detailedItem && (
        <ItemDetailModal 
          item={detailedItem}
          onClose={handleCloseModal}
          onSplitStack={handleSplitStack}
          getIconByName={getIconByName}
        />
      )}
    </div>
  );
};

export default StashView; 