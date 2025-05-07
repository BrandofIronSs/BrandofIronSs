import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './ItemDetailModal.css';

// Component for displaying detailed item information and stack splitting functionality
const ItemDetailModal = ({ item, onClose, onSplitStack, getIconByName }) => {
  // State for split quantity
  const [splitQuantity, setSplitQuantity] = useState(1);

  // Handle changing the split quantity
  const handleSplitQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && item && value < item.quantity) {
      setSplitQuantity(value);
    }
  };

  // Handle splitting a stack
  const handleSplitStack = () => {
    if (!item || splitQuantity <= 0 || splitQuantity >= item.quantity) return;
    
    // Call the provided onSplitStack function with the item and split quantity
    onSplitStack(item, splitQuantity);
  };

  // If no item is provided, don't render anything
  if (!item) return null;

  return (
    <div className="item-detail-modal-overlay">
      <div className="item-detail-modal">
        <button className="close-modal-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className="modal-item-header">
          <div className="modal-item-icon">
            <FontAwesomeIcon 
              icon={getIconByName(item.icon)} 
              style={{ color: item.color }}
            />
          </div>
          <div className="modal-item-title">
            <h3>{item.name}</h3>
            <span className="modal-item-type">{item.type} {item.subType && `- ${item.subType}`}</span>
            {item.quality && <span className="modal-item-quality">{item.quality}</span>}
          </div>
        </div>
        
        <div className="modal-item-details">
          {item.description && (
            <p className="modal-item-description">{item.description}</p>
          )}
          
          {item.stats && (
            <div className="modal-item-stats">
              <h4>Stats</h4>
              <ul>
                {Object.entries(item.stats).map(([stat, value]) => (
                  <li key={stat}>
                    <span className="stat-name">{stat}:</span> 
                    <span className="stat-value">{typeof value === 'object' ? value.base : value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {item.combatStats && (
            <div className="modal-item-combat-stats">
              <h4>Combat Stats</h4>
              <ul>
                {Object.entries(item.combatStats).map(([stat, value]) => (
                  <li key={stat}>
                    <span className="stat-name">{stat}:</span> 
                    <span className="stat-value">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {item.stackable && (
            <div className="modal-item-stack-info">
              <p>Quantity: {item.quantity} / {item.maxStack || 'Unlimited'}</p>
            </div>
          )}
          
          {item.value && (
            <div className="modal-item-value">
              <p>Value: {item.value} gold</p>
            </div>
          )}
        </div>
        
        {/* Split stack feature */}
        {item.quantity > 1 && (
          <div className="modal-split-stack">
            <h4>Split Stack</h4>
            <div className="split-controls">
              <input 
                type="number" 
                min="1" 
                max={item.quantity - 1} 
                value={splitQuantity}
                onChange={handleSplitQuantityChange}
                className="split-quantity-input"
              />
              <button 
                className="split-stack-btn"
                onClick={handleSplitStack}
              >
                Split Stack
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetailModal; 