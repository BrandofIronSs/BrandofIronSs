import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faHandHoldingUsd, faCartPlus, faStore, faExclamationCircle, faCheckCircle, faTags } from '@fortawesome/free-solid-svg-icons';
import './ThePaupersHand.css';

// The Pauper's Hand component - System-driven shop
const ThePaupersHand = ({ 
  shopListings, // Shop inventory from shopItems.js
  allItemDefinitions, // All item definitions from items.js
  gold, // Player's current gold amount
  purchaseShopItem, // Function to handle purchase
  addLogEntry // Function to add log entries
}) => {
  // State for transaction feedback
  const [transactionMessage, setTransactionMessage] = useState(null);
  
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Clear transaction message after display time
  useEffect(() => {
    if (transactionMessage) {
      const timer = setTimeout(() => {
        setTransactionMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [transactionMessage]);

  // Get unique categories from shop listings
  const categories = useMemo(() => {
    const uniqueCategories = ['All'];
    shopListings.forEach(listing => {
      if (listing.category && !uniqueCategories.includes(listing.category)) {
        uniqueCategories.push(listing.category);
      }
    });
    return uniqueCategories;
  }, [shopListings]);

  // Filter shop listings by active category
  const filteredShopListings = useMemo(() => {
    if (activeCategory === 'All') {
      return shopListings;
    }
    return shopListings.filter(listing => listing.category === activeCategory);
  }, [shopListings, activeCategory]);

  // Handle item purchase
  const handlePurchase = (shopListingId) => {
    // Find the listing
    const listing = shopListings.find(item => item.shopListingId === shopListingId);
    if (!listing) {
      console.error(`Shop listing not found: ${shopListingId}`);
      return;
    }

    // Find the actual item definition
    const itemDef = allItemDefinitions.find(item => item.id === listing.itemId);
    if (!itemDef) {
      console.error(`Item definition not found for: ${listing.itemId}`);
      return;
    }

    // Call purchase function
    const success = purchaseShopItem(shopListingId);
    
    if (success) {
      // Show success message with item name
      setTransactionMessage({
        text: `Purchased ${listing.overrideName || itemDef.name}${listing.quantitySold > 1 ? ` (x${listing.quantitySold})` : ''}!`,
        type: 'success'
      });
      
      // Add log entry
      const itemName = listing.overrideName || itemDef.name;
      addLogEntry(`You purchased ${itemName}${listing.quantitySold > 1 ? ` (x${listing.quantitySold})` : ''} for ${listing.priceGold} gold.`);
    } else {
      // Show error message
      setTransactionMessage({
        text: gold < listing.priceGold 
          ? "Not enough gold!" 
          : listing.stock.current === 0 
          ? "Out of stock!" 
          : "Purchase failed!",
        type: 'error'
      });
    }
  };

  // Check if player can afford an item
  const canAfford = (priceGold) => {
    return gold >= priceGold;
  };

  // Check if an item is in stock
  const isInStock = (stock) => {
    return stock.current > 0;
  };

  // Get stock display class based on current stock level
  const getStockDisplayClass = (stock) => {
    if (stock.current === Infinity) return '';
    if (stock.current === 0) return 'out-of-stock';
    if (stock.current <= Math.ceil(stock.max / 3)) return 'low-stock';
    return '';
  };

  // Format stock display text
  const formatStockDisplay = (stock) => {
    if (stock.current === Infinity) return 'Unlimited';
    return `Stock: ${stock.current}/${stock.max || stock.current}`;
  };

  // Handle category tab click
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Render
  return (
    <div className="paupers-hand-container">
      {/* Shop header with thematic title */}
      <div className="shop-header">
        <h1>
          <FontAwesomeIcon icon={faHandHoldingUsd} className="shop-icon" />
          The Pauper's Hand
        </h1>
        <p className="shop-description">
          A humble collection of wares offered by a mysterious trader. Prices firm, haggling not permitted.
        </p>
      </div>

      {/* Main shop content */}
      <div className="shop-content">
        {/* Shop items section */}
        <div className="shop-items-section">
          <div className="section-title">
            <FontAwesomeIcon icon={faStore} />
            Available Wares
          </div>

          {/* Gold display */}
          <div className="player-resources">
            <div className="gold-display">
              <FontAwesomeIcon icon={faCoins} className="gold-icon" />
              <span className="gold-amount">{gold}</span>
            </div>
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

          {/* Shop items grid */}
          <div className="shop-items-grid">
            {filteredShopListings && filteredShopListings.length > 0 ? (
              filteredShopListings.map((listing) => {
                // Get the actual item definition
                const itemDef = allItemDefinitions.find(item => item.id === listing.itemId);
                if (!itemDef) return null;

                // Determine if player can buy this item
                const affordable = canAfford(listing.priceGold);
                const inStock = isInStock(listing.stock);
                const canBuy = affordable && inStock;

                // Get item display info
                const itemName = listing.overrideName || itemDef.name;
                const itemDescription = listing.overrideDescription || itemDef.description;
                const itemIcon = listing.overrideIcon || itemDef.icon;

                return (
                  <div 
                    key={listing.shopListingId} 
                    className={`shop-item-card ${canBuy ? 'can-buy' : !inStock ? 'out-of-stock' : 'cannot-buy'}`}
                  >
                    {/* Item Header */}
                    <div className="item-header">
                      <div className="item-icon-wrapper">
                        <span className="item-icon">{itemIcon}</span>
                      </div>
                      <h3 className="item-name">
                        {itemName}
                        {listing.quantitySold > 1 && ` (x${listing.quantitySold})`}
                      </h3>
                    </div>

                    {/* Item Body */}
                    <div className="item-body">
                      <p className="item-description">{itemDescription}</p>
                      
                      <div className="item-price">
                        <FontAwesomeIcon icon={faCoins} className="gold-icon-small" />
                        <span>{listing.priceGold}</span>
                      </div>
                      
                      {listing.stock.current !== Infinity && (
                        <div className={`item-stock ${getStockDisplayClass(listing.stock)}`}>
                          {formatStockDisplay(listing.stock)}
                        </div>
                      )}
                    </div>

                    {/* Item Footer */}
                    <div className="item-footer">
                      <button 
                        className="buy-button"
                        disabled={!canBuy}
                        onClick={() => handlePurchase(listing.shopListingId)}
                      >
                        <FontAwesomeIcon icon={faCartPlus} className="buy-icon" />
                        Buy
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-shop">
                {activeCategory === 'All' 
                  ? "No wares available at this time." 
                  : `No ${activeCategory.toLowerCase()} currently available.`}
              </div>
            )}
          </div>
        </div>
      </div>

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

export default ThePaupersHand; 