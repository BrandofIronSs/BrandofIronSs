// src/gameData/prayerLootTable.js
// Loot table for the Whispers of Fate prayer/gacha system

/**
 * Loot table structure:
 * - type: 'material' (stackable items), 'equipment' (gear), 'mercenary' (hireable characters)
 * - itemId/definitionId: Reference to the ID in items.js or mercenaries.js
 * - quantity: For stackable items, specifies min/max range
 * - possibleQualities: For equipment, specifies potential qualities
 * - rarity: UI display and affects card border/effects ('common', 'uncommon', 'rare', 'epic', 'legendary')
 * - weight: Relative probability (higher = more common)
 */

export const prayerLootTable = [
  // --------- MATERIALS (stackable) ---------
  // Common materials
  {
    type: 'material',
    itemId: 'iron_ore',
    quantity: { min: 10, max: 25 },
    rarity: 'common',
    weight: 80
  },
  {
    type: 'material',
    itemId: 'wood',
    quantity: { min: 8, max: 20 },
    rarity: 'common',
    weight: 80
  },
  {
    type: 'material',
    itemId: 'herbs',
    quantity: { min: 5, max: 15 },
    rarity: 'common',
    weight: 75
  },
  {
    type: 'material',
    itemId: 'ruined_hide',
    quantity: { min: 3, max: 8 },
    rarity: 'common',
    weight: 70
  },
  
  // Uncommon materials
  {
    type: 'material',
    itemId: 'leather',
    quantity: { min: 3, max: 10 },
    rarity: 'uncommon',
    weight: 40
  },
  {
    type: 'material',
    itemId: 'steel_ingot',
    quantity: { min: 2, max: 5 },
    rarity: 'uncommon',
    weight: 35
  },
  
  // Rare materials
  {
    type: 'material',
    itemId: 'magic_crystal',
    quantity: { min: 1, max: 3 },
    rarity: 'rare',
    weight: 15
  },
  
  // Special resources
  {
    type: 'resource',
    resourceId: 'vitaeEssence',
    quantity: { min: 5, max: 15 },
    name: 'Vitae Essence',
    icon: '🧪',
    rarity: 'uncommon',
    weight: 30
  },
  {
    type: 'resource',
    resourceId: 'vitaeEssence',
    quantity: { min: 20, max: 50 },
    name: 'Vitae Essence',
    icon: '🧪',
    rarity: 'rare',
    weight: 15
  },
  {
    type: 'resource',
    resourceId: 'behelitShard',
    quantity: { min: 1, max: 2 },
    name: 'Behelit Shard',
    icon: '👁️',
    rarity: 'rare',
    weight: 10
  },
  {
    type: 'resource',
    resourceId: 'behelitShard',
    quantity: { min: 3, max: 5 },
    name: 'Behelit Shard',
    icon: '👁️',
    rarity: 'epic',
    weight: 5
  },
  {
    type: 'resource',
    resourceId: 'gold',
    quantity: { min: 50, max: 100 },
    name: 'Gold',
    icon: '💰',
    rarity: 'common',
    weight: 60
  },
  {
    type: 'resource',
    resourceId: 'gold',
    quantity: { min: 100, max: 250 },
    name: 'Gold',
    icon: '💰',
    rarity: 'uncommon',
    weight: 30
  },
  {
    type: 'resource',
    resourceId: 'echoes',
    quantity: { min: 1, max: 3 },
    name: 'Echoes',
    icon: '✧',
    rarity: 'rare',
    weight: 10
  },
  
  // --------- EQUIPMENT (weapons, armor, accessories) ---------
  // Common equipment
  {
    type: 'equipment',
    itemId: 'rusty_dagger',
    possibleQualities: ['Crude', 'Common'],
    rarity: 'common',
    weight: 50
  },
  {
    type: 'equipment',
    itemId: 'tattered_rags',
    possibleQualities: ['Crude', 'Common'],
    rarity: 'common',
    weight: 45
  },
  
  // Uncommon equipment
  {
    type: 'equipment',
    itemId: 'iron_sword',
    possibleQualities: ['Common', 'Sturdy'],
    rarity: 'uncommon',
    weight: 25
  },
  {
    type: 'equipment',
    itemId: 'leather_armor',
    possibleQualities: ['Common', 'Sturdy'],
    rarity: 'uncommon',
    weight: 25
  },
  {
    type: 'equipment',
    itemId: 'iron_helmet',
    possibleQualities: ['Common', 'Sturdy'],
    rarity: 'uncommon',
    weight: 20
  },
  {
    type: 'equipment',
    itemId: 'iron_bracers',
    possibleQualities: ['Common', 'Sturdy'],
    rarity: 'uncommon',
    weight: 20
  },
  {
    type: 'equipment',
    itemId: 'crude_axe',
    possibleQualities: ['Common', 'Sturdy'],
    rarity: 'uncommon',
    weight: 22
  },
  
  // Rare equipment
  {
    type: 'equipment',
    itemId: 'lucky_charm',
    possibleQualities: ['Sturdy', 'Fine'],
    rarity: 'rare',
    weight: 10
  },
  
  // --------- MERCENARIES ---------
  // Common mercenaries
  {
    type: 'mercenary',
    definitionId: 'merc_guts_grunt',
    rarity: 'common',
    weight: 20
  },
  
  // Uncommon mercenaries
  {
    type: 'mercenary',
    definitionId: 'merc_nimble_rogue',
    rarity: 'uncommon',
    weight: 10
  },
  
  // Rare mercenaries
  {
    type: 'mercenary',
    definitionId: 'merc_hedge_mage',
    rarity: 'rare',
    weight: 5
  }
];

/**
 * Helper function for weighted random selection from the loot table
 * @param {Array} items - Array of items with weight property
 * @param {String} minRarity - Optional minimum rarity to enforce
 * @returns {Object} The selected item
 */
export const selectWeightedLoot = (items, minRarity = null) => {
  // Filter by minimum rarity if provided
  let eligibleItems = items;
  
  if (minRarity) {
    const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const minRarityIndex = rarityOrder.indexOf(minRarity.toLowerCase());
    
    if (minRarityIndex !== -1) {
      eligibleItems = items.filter(item => {
        const itemRarityIndex = rarityOrder.indexOf(item.rarity.toLowerCase());
        return itemRarityIndex >= minRarityIndex;
      });
    }
    
    // If no eligible items found, fall back to all items (should rarely happen)
    if (eligibleItems.length === 0) {
      eligibleItems = items;
    }
  }
  
  // Calculate total weight
  const totalWeight = eligibleItems.reduce((sum, item) => sum + (item.weight || 1), 0);
  
  // Select an item based on weight
  let random = Math.random() * totalWeight;
  let cumulativeWeight = 0;
  
  for (const item of eligibleItems) {
    cumulativeWeight += (item.weight || 1);
    if (random <= cumulativeWeight) {
      return { ...item }; // Return a copy
    }
  }
  
  // Fallback to last item (should rarely happen)
  return { ...eligibleItems[eligibleItems.length - 1] };
};

/**
 * Generates a specific quantity for stackable items
 * @param {Object} quantityRange - Object with min and max properties
 * @returns {Number} The randomly generated quantity
 */
export const generateQuantity = (quantityRange) => {
  if (!quantityRange || typeof quantityRange.min !== 'number' || typeof quantityRange.max !== 'number') {
    return 1;
  }
  
  return Math.floor(Math.random() * (quantityRange.max - quantityRange.min + 1)) + quantityRange.min;
};

/**
 * Selects a random quality from the possibleQualities array
 * @param {Array} possibleQualities - Array of quality strings
 * @returns {String} The selected quality
 */
export const selectRandomQuality = (possibleQualities) => {
  if (!Array.isArray(possibleQualities) || possibleQualities.length === 0) {
    return 'Common';
  }
  
  return possibleQualities[Math.floor(Math.random() * possibleQualities.length)];
}; 