import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCoins, 
  faExchangeAlt, 
  faCartPlus, 
  faStore, 
  faExclamationCircle, 
  faCheckCircle, 
  faUser, 
  faTags,
  faMoneyBillWave,
  faHandHoldingUsd
} from '@fortawesome/free-solid-svg-icons';
import './WyrdExchange.css';

// Wyrd Exchange component - Simulated player market
const WyrdExchange = ({ 
  marketListings, 
  allItemDefinitions, 
  gold,
  berserkBoiCurrency, 
  stashItems,
  purchaseMarketItem,
  sellItemToMarket,
  addLogEntry,
  MARKET_TAX_RATE 
}) => {
  // State for transaction feedback
  const [transactionMessage, setTransactionMessage] = useState(null);
  
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState('All');
  
  // State for the sell modal
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sellableItems, setSellableItems] = useState([]);
  const [sellQuantity, setSellQuantity] = useState(1);
  
  // Clear transaction message after display time
  useEffect(() => {
    if (transactionMessage) {
      const timer = setTimeout(() => {
        setTransactionMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [transactionMessage]);

  // Get unique categories from market listings
  const categories = useMemo(() => {
    const uniqueCategories = ['All'];
    marketListings.forEach(listing => {
      if (listing.category && !uniqueCategories.includes(listing.category)) {
        uniqueCategories.push(listing.category);
      }
    });
    return uniqueCategories;
  }, [marketListings]);

  // Filter market listings by active category
  const filteredMarketListings = useMemo(() => {
    if (activeCategory === 'All') {
      return marketListings;
    }
    return marketListings.filter(listing => listing.category === activeCategory);
  }, [marketListings, activeCategory]);
  
  // Get sellable items from player stash when sell modal opens
  useEffect(() => {
    if (showSellModal) {
      // Filter out stackable materials and equipment that can be sold
      const itemsToSell = stashItems.filter(item => 
        // Exclude basic resources that can't be sold
        !['vitae_essence', 'behelit_shard', 'echoes', 'gold', 'berserkBoiCurrency'].includes(item.id)
      );
      setSellableItems(itemsToSell);
    }
  }, [showSellModal, stashItems]);

  // Handle item purchase
  const handlePurchase = (listingId) => {
    // Find the listing
    const listing = marketListings.find(item => item.listingId === listingId);
    if (!listing) {
      console.error(`Market listing not found: ${listingId}`);
      return;
    }

    // Find the actual item definition
    const itemDef = allItemDefinitions.find(item => item.id === listing.itemId);
    if (!itemDef) {
      console.error(`Item definition not found for: ${listing.itemId}`);
      return;
    }

    // Calculate tax amount
    const priceType = listing.priceBerserkBoi !== null ? 'BerserkBoi' : 'Gold';
    const basePrice = priceType === 'BerserkBoi' ? listing.priceBerserkBoi : listing.priceGold;
    const taxAmount = Math.ceil(basePrice * MARKET_TAX_RATE);
    const totalPrice = basePrice + taxAmount;

    // Call purchase function
    const success = purchaseMarketItem(listingId);
    
    if (success) {
      // Show success message with item name
      setTransactionMessage({
        text: `Purchased ${itemDef.name}${listing.quantity > 1 ? ` (x${listing.quantity})` : ''}!`,
        type: 'success'
      });
      
      // Add log entry - this also happens in purchaseMarketItem
      const currencyType = priceType === 'BerserkBoi' ? '$BerserkBoi' : 'Gold';
      addLogEntry(`You purchased ${itemDef.name}${listing.quantity > 1 ? ` (x${listing.quantity})` : ''} for ${basePrice} ${currencyType} + ${taxAmount} tax.`);
    } else {
      // Show error message
      let errorMsg = "Purchase failed!";
      
      if ((priceType === 'BerserkBoi' && berserkBoiCurrency < totalPrice) || 
          (priceType === 'Gold' && gold < totalPrice)) {
        errorMsg = `Not enough ${priceType}!`;
      } else if (listing.currentStock === 0) {
        errorMsg = "Out of stock!";
      }
      
      setTransactionMessage({
        text: errorMsg,
        type: 'error'
      });
    }
  };

  // Handle item selling
  const handleSellItem = () => {
    if (!selectedItem) return;
    
    // Get the actual quantity to sell (either the selected quantity or all for non-stackable items)
    const quantityToSell = selectedItem.stackable ? sellQuantity : 1;
    
    // Call sell function
    const success = sellItemToMarket(
      selectedItem.id, 
      quantityToSell, 
      selectedItem.instanceId // Only needed for non-stackable items
    );
    
    if (success) {
      // Close the modal
      setShowSellModal(false);
      setSelectedItem(null);
      setSellQuantity(1);
      
      // Show success message
      setTransactionMessage({
        text: `Sold ${selectedItem.name}${quantityToSell > 1 ? ` (x${quantityToSell})` : ''}!`,
        type: 'success'
      });
    } else {
      // Show error message
      setTransactionMessage({
        text: "Failed to sell item!",
        type: 'error'
      });
    }
  };

  // Check if player can afford an item
  const canAfford = (listing) => {
    // Calculate total price including tax
    const priceType = listing.priceBerserkBoi !== null ? 'BerserkBoi' : 'Gold';
    const basePrice = priceType === 'BerserkBoi' ? listing.priceBerserkBoi : listing.priceGold;
    const taxAmount = Math.ceil(basePrice * MARKET_TAX_RATE);
    const totalPrice = basePrice + taxAmount;
    
    // Check if player has enough currency
    return priceType === 'BerserkBoi' 
      ? berserkBoiCurrency >= totalPrice 
      : gold >= totalPrice;
  };

  // Check if an item is in stock
  const isInStock = (stock) => {
    return stock > 0;
  };

  // Format price display for listings
  const formatPrice = (listing) => {
    if (listing.priceBerserkBoi !== null) {
      const tax = Math.ceil(listing.priceBerserkBoi * MARKET_TAX_RATE);
      return `${listing.priceBerserkBoi} $BB + ${tax} tax`;
    } else {
      const tax = Math.ceil(listing.priceGold * MARKET_TAX_RATE);
      return `${listing.priceGold} Gold + ${tax} tax`;
    }
  };

  // Handle category tab click
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  // Select item to sell
  const selectItemToSell = (item) => {
    setSelectedItem(item);
    setSellQuantity(1); // Reset quantity
  };
  
  // Handle sell quantity change
  const handleSellQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && selectedItem && value <= selectedItem.quantity) {
      setSellQuantity(value);
    }
  };
  
  // Estimate sell price for an item
  const estimateSellPrice = (item, quantity = 1) => {
    if (!item) return null;
    
    // Find item definition
    const itemDef = allItemDefinitions.find(def => def.id === item.id);
    if (!itemDef) return null;
    
    // Base value from item definition
    const baseValue = itemDef.value || 0;
    
    // Apply quality modifier for non-stackable items
    let adjustedValue = baseValue;
    if (item.quality && item.quality !== 'Common') {
      const qualityModifiers = {
        'Crude': 0.8,
        'Common': 1.0,
        'Sturdy': 1.2,
        'Quality': 1.5,
        'Masterwork': 2.0
      };
      
      adjustedValue = Math.round(baseValue * (qualityModifiers[item.quality] || 1.0));
    }
    
    // Apply type-based buyback rate
    const buybackRate = 0.5; // Default 50% rate
    
    // Calculate base sell price
    const baseSellPrice = Math.round(adjustedValue * buybackRate * quantity);
    
    // Calculate tax amount
    const taxAmount = Math.ceil(baseSellPrice * MARKET_TAX_RATE);
    
    // Calculate final amount player receives
    const finalAmount = baseSellPrice - taxAmount;
    
    return {
      baseSellPrice,
      taxAmount,
      finalAmount
    };
  };

  // Render
  return (
    <div className="wyrd-exchange-container">
      {/* Header section */}
      <div className="exchange-header">
        <h1>
          <FontAwesomeIcon icon={faExchangeAlt} className="exchange-icon" />
          Wyrd Exchange
        </h1>
        <p className="exchange-description">
          A mysterious market where shadowy figures trade rare goods. All transactions are taxed by the entity that maintains this strange bazaar.
        </p>
      </div>

      {/* Main content */}
      <div className="exchange-content">
        {/* Exchange main section */}
        <div className="exchange-section">
          <div className="section-title">
            <FontAwesomeIcon icon={faStore} />
            Market Listings
          </div>

          {/* Player resources display */}
          <div className="player-resources">
            <div className="resource-display">
              <FontAwesomeIcon icon={faCoins} className="gold-icon" />
              <span className="resource-amount">{gold} Gold</span>
            </div>
            <div className="resource-display berserk-boi">
              <span className="bb-symbol">$BB</span>
              <span className="resource-amount">{berserkBoiCurrency} $BerserkBoi</span>
            </div>
            <div className="tax-info">
              <FontAwesomeIcon icon={faTags} />
              <span>Market Tax: {MARKET_TAX_RATE * 100}%</span>
            </div>
            
            {/* Sell button */}
            <button className="sell-button" onClick={() => setShowSellModal(true)}>
              <FontAwesomeIcon icon={faMoneyBillWave} className="sell-icon" />
              Sell Items
            </button>
          </div>

          {/* Category tabs */}
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category}
                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Market listings grid */}
          <div className="market-listings-grid">
            {filteredMarketListings && filteredMarketListings.length > 0 ? (
              filteredMarketListings.map((listing) => {
                // Get the actual item definition
                const itemDef = allItemDefinitions.find(item => item.id === listing.itemId);
                if (!itemDef) return null;

                // Determine if player can buy this item
                const affordable = canAfford(listing);
                const inStock = isInStock(listing.currentStock);
                const canBuy = affordable && inStock;

                // Create display name with quality if provided
                const qualityPrefix = listing.quality && listing.quality !== 'Common' 
                  ? `${listing.quality} ` 
                  : '';
                  
                const itemName = `${qualityPrefix}${itemDef.name}`;

                return (
                  <div 
                    key={listing.listingId} 
                    className={`market-item-card ${canBuy ? 'can-buy' : !inStock ? 'out-of-stock' : 'cannot-buy'}`}
                  >
                    {/* Item Header */}
                    <div className="item-header">
                      <div className="item-icon-wrapper">
                        <span className="item-icon">{itemDef.icon}</span>
                      </div>
                      <div className="item-title-area">
                        <h3 className="item-name">
                          {itemName}
                          {listing.quantity > 1 && ` (x${listing.quantity})`}
                        </h3>
                        <div className="seller-info">
                          <FontAwesomeIcon icon={faUser} className="seller-icon" />
                          <span className="seller-type">{listing.sellerType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Item Body */}
                    <div className="item-body">
                      <p className="item-description">{itemDef.description}</p>
                      
                      <div className={`item-price ${listing.priceBerserkBoi !== null ? 'bb-price' : 'gold-price'}`}>
                        {listing.priceBerserkBoi !== null ? (
                          <span className="bb-symbol">$BB</span>
                        ) : (
                          <FontAwesomeIcon icon={faCoins} className="gold-icon-small" />
                        )}
                        <span>{formatPrice(listing)}</span>
                      </div>
                      
                      <div className={`item-stock ${listing.currentStock === 0 ? 'out-of-stock' : ''}`}>
                        Stock: {listing.currentStock}/{listing.initialStock}
                      </div>
                    </div>

                    {/* Item Footer */}
                    <div className="item-footer">
                      <button 
                        className="buy-button"
                        disabled={!canBuy}
                        onClick={() => handlePurchase(listing.listingId)}
                      >
                        <FontAwesomeIcon icon={faCartPlus} className="buy-icon" />
                        Buy
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-exchange">
                {activeCategory === 'All' 
                  ? "No listings available in the exchange." 
                  : `No ${activeCategory.toLowerCase()} currently available.`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sell Modal */}
      {showSellModal && (
        <div className="modal-overlay">
          <div className="sell-modal">
            <div className="modal-header">
              <h2>
                <FontAwesomeIcon icon={faHandHoldingUsd} />
                Offer Your Wares
              </h2>
              <button className="close-modal" onClick={() => setShowSellModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">
                Select an item to sell to the exchange. All sales are subject to a {MARKET_TAX_RATE * 100}% market tax.
              </p>
              
              {/* Sellable items grid */}
              <div className="sellable-items-grid">
                {sellableItems.length > 0 ? (
                  sellableItems.map(item => {
                    const isSelected = selectedItem && 
                      (item.instanceId 
                        ? item.instanceId === selectedItem.instanceId 
                        : item.id === selectedItem.id);
                    
                    return (
                      <div 
                        key={item.instanceId || `${item.id}-${item.quantity}`}
                        className={`sellable-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => selectItemToSell(item)}
                      >
                        <div className="item-icon-wrapper">
                          <span className="item-icon">{item.icon}</span>
                        </div>
                        <div className="sellable-item-details">
                          <div className="sellable-item-name">
                            {item.name}
                            {item.stackable && item.quantity > 1 && ` (x${item.quantity})`}
                          </div>
                          {item.quality && <div className="sellable-item-quality">{item.quality}</div>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-sellable-items">
                    No items available to sell.
                  </div>
                )}
              </div>
              
              {/* Sell details */}
              {selectedItem && (
                <div className="sell-details">
                  <h3>Sell Details</h3>
                  
                  {selectedItem.stackable && selectedItem.quantity > 1 && (
                    <div className="quantity-selector">
                      <label>Quantity to sell:</label>
                      <input 
                        type="number" 
                        min="1" 
                        max={selectedItem.quantity} 
                        value={sellQuantity}
                        onChange={handleSellQuantityChange}
                      />
                      <span className="max-quantity">
                        / {selectedItem.quantity}
                      </span>
                    </div>
                  )}
                  
                  {/* Price estimate */}
                  {(() => {
                    const priceEstimate = estimateSellPrice(selectedItem, sellQuantity);
                    
                    if (priceEstimate) {
                      return (
                        <div className="price-estimate">
                          <div className="estimate-row">
                            <span>Base value:</span>
                            <span>{priceEstimate.baseSellPrice} Gold</span>
                          </div>
                          <div className="estimate-row">
                            <span>Market tax:</span>
                            <span>-{priceEstimate.taxAmount} Gold</span>
                          </div>
                          <div className="estimate-row total">
                            <span>You receive:</span>
                            <span>{priceEstimate.finalAmount} Gold</span>
                          </div>
                        </div>
                      );
                    }
                    
                    return <div className="no-estimate">Unable to estimate value</div>;
                  })()}
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowSellModal(false)}>
                Cancel
              </button>
              <button 
                className="confirm-sell-button" 
                disabled={!selectedItem}
                onClick={handleSellItem}
              >
                <FontAwesomeIcon icon={faMoneyBillWave} className="sell-icon" />
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction message popup */}
      {transactionMessage && (
        <div className={`transaction-message ${transactionMessage.type === 'success' ? 'transaction-success' : 'transaction-error'}`}>
          <FontAwesomeIcon 
            icon={transactionMessage.type === 'success' ? faCheckCircle : faExclamationCircle} 
            style={{ marginRight: '0.5rem' }} 
          />
          {transactionMessage.text}
        </div>
      )}
    </div>
  );
};

export default WyrdExchange; 