// Define different rarity levels and their weights
const RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
};

// Weight distribution for standard pulls
const RARITY_WEIGHTS = {
  [RARITY.COMMON]: 60,
  [RARITY.UNCOMMON]: 25,
  [RARITY.RARE]: 10,
  [RARITY.EPIC]: 4,
  [RARITY.LEGENDARY]: 1,
};

// Pity system adjustments - increases chances after multiple pulls
const PITY_ADJUSTMENTS = {
  standardPull: {
    rare: {
      minPulls: 5,
      adjustment: 0.5,
    },
    epic: {
      minPulls: 8,
      adjustment: 0.3,
    },
    legendary: {
      minPulls: 10,
      adjustment: 0.1,
    },
  },
};

// Pool definitions for different gacha categories
export const gachaPools = {
  // Standard prayer pool - general rewards
  standardPrayer: {
    id: 'standardPrayer',
    name: 'Whispers of the Beyond',
    description: 'Commune with the spirits to receive their blessings - materials, equipment, and rare treasures await.',
    requiredResource: 'echoes',
    singlePullCost: 1,
    tenPullCost: 9, // Discount for 10 pulls
    guaranteedRarityAtPity: RARITY.RARE,
    pityCounter: 0,
    items: [
      // Resources - Common
      {
        id: 'iron_ore_small',
        type: 'resource',
        name: 'Iron Ore',
        resourceId: 'iron_ore',
        quantity: 10,
        icon: '⛏️',
        rarity: RARITY.COMMON,
        description: 'Basic materials for crafting',
        weight: 10
      },
      {
        id: 'wood_small',
        type: 'resource',
        name: 'Wood',
        resourceId: 'wood',
        quantity: 12,
        icon: '🪵',
        rarity: RARITY.COMMON,
        description: 'Common crafting material',
        weight: 10
      },
      {
        id: 'herbs_small',
        type: 'resource',
        name: 'Herbs',
        resourceId: 'herbs',
        quantity: 8,
        icon: '🌿',
        rarity: RARITY.COMMON,
        description: 'Common herbs for potions',
        weight: 10
      },
      {
        id: 'leather_small',
        type: 'resource',
        name: 'Leather',
        resourceId: 'leather',
        quantity: 6,
        icon: '🧶',
        rarity: RARITY.COMMON,
        description: 'Basic material for armor',
        weight: 10
      },
      {
        id: 'gold_small',
        type: 'resource',
        name: 'Gold',
        resourceId: 'gold',
        quantity: 50,
        icon: '💰',
        rarity: RARITY.COMMON,
        description: 'A small amount of gold',
        weight: 20
      },
      
      // Resources - Uncommon
      {
        id: 'steel_ingot_small',
        type: 'resource',
        name: 'Steel Ingot',
        resourceId: 'steel_ingot',
        quantity: 3,
        icon: '🧱',
        rarity: RARITY.UNCOMMON,
        description: 'Refined metal for better equipment',
        weight: 8
      },
      {
        id: 'gold_medium',
        type: 'resource',
        name: 'Gold Cache',
        resourceId: 'gold',
        quantity: 120,
        icon: '💰',
        rarity: RARITY.UNCOMMON,
        description: 'A decent amount of gold',
        weight: 10
      },
      {
        id: 'vitae_essence_small',
        type: 'resource',
        name: 'Vitae Essence',
        resourceId: 'vitaeEssence',
        quantity: 10,
        icon: '🧪',
        rarity: RARITY.UNCOMMON,
        description: 'A small amount of Vitae Essence',
        weight: 8
      },
      
      // Resources - Rare
      {
        id: 'magic_crystal_small',
        type: 'resource',
        name: 'Magic Crystal',
        resourceId: 'magic_crystal',
        quantity: 2,
        icon: '💎',
        rarity: RARITY.RARE,
        description: 'Rare crystals pulsing with magical energy',
        weight: 6
      },
      {
        id: 'vitae_essence_medium',
        type: 'resource',
        name: 'Vitae Essence Vial',
        resourceId: 'vitaeEssence',
        quantity: 25,
        icon: '🧪',
        rarity: RARITY.RARE,
        description: 'A good amount of Vitae Essence',
        weight: 5
      },
      {
        id: 'behelit_shard_small',
        type: 'resource',
        name: 'Behelit Shard',
        resourceId: 'behelitShard',
        quantity: 1,
        icon: '👁️',
        rarity: RARITY.RARE,
        description: 'A fragment of a mysterious artifact',
        weight: 4
      },
      
      // Resources - Epic
      {
        id: 'vitae_essence_large',
        type: 'resource',
        name: 'Vitae Essence Flask',
        resourceId: 'vitaeEssence',
        quantity: 60,
        icon: '🧪',
        rarity: RARITY.EPIC,
        description: 'A substantial amount of Vitae Essence',
        weight: 3
      },
      {
        id: 'behelit_shard_medium',
        type: 'resource',
        name: 'Behelit Shard Cluster',
        resourceId: 'behelitShard',
        quantity: 3,
        icon: '👁️',
        rarity: RARITY.EPIC,
        description: 'Multiple fragments of a mysterious artifact',
        weight: 2
      },
      
      // Resources - Legendary
      {
        id: 'behelit_shard_large',
        type: 'resource',
        name: 'Behelit Fragment',
        resourceId: 'behelitShard',
        quantity: 8,
        icon: '👁️',
        rarity: RARITY.LEGENDARY,
        description: 'A significant piece of a mysterious artifact',
        weight: 1
      },
      
      // Item unlocks - gear with different rarities
      {
        id: 'steel_sword_unlock',
        type: 'item',
        itemId: 'steel_sword',
        name: 'Steel Sword',
        icon: '⚔️',
        rarity: RARITY.UNCOMMON,
        description: 'A well-crafted steel sword',
        weight: 6
      },
      {
        id: 'reinforced_armor_unlock',
        type: 'item',
        itemId: 'reinforced_armor',
        name: 'Reinforced Armor',
        icon: '🛡️',
        rarity: RARITY.UNCOMMON,
        description: 'Sturdy armor reinforced with steel plates',
        weight: 6
      },
      {
        id: 'elixir_of_vigor_unlock',
        type: 'item',
        itemId: 'elixir_of_vigor',
        name: 'Elixir of Vigor',
        icon: '🧪',
        rarity: RARITY.RARE,
        description: 'Restores health and temporarily increases strength',
        weight: 5
      },
      {
        id: 'enchanted_bow_unlock',
        type: 'item',
        itemId: 'enchanted_bow',
        name: 'Enchanted Bow',
        icon: '🏹',
        rarity: RARITY.RARE,
        description: 'A bow imbued with magical energy',
        weight: 5
      },
      {
        id: 'black_iron_helm_unlock',
        type: 'item',
        itemId: 'black_iron_helm',
        name: 'Black Iron Helm',
        icon: '🪖',
        rarity: RARITY.EPIC,
        description: 'An imposing helmet made of rare black iron',
        weight: 2
      },
      {
        id: 'dragonscale_cloak_unlock',
        type: 'item',
        itemId: 'dragonscale_cloak',
        name: 'Dragonscale Cloak',
        icon: '🧥',
        rarity: RARITY.LEGENDARY,
        description: 'A cloak made from the scales of an ancient dragon',
        weight: 1
      }
    ]
  },
  
  // Equipment-focused pool for gear upgrades
  equipmentPrayer: {
    id: 'equipmentPrayer',
    name: 'Arms of the Iron Covenant',
    description: 'Call upon the spirits of fallen warriors. Higher chance for weapons and armor.',
    requiredResource: 'echoes',
    singlePullCost: 2,
    tenPullCost: 18,
    guaranteedRarityAtPity: RARITY.RARE,
    pityCounter: 0,
    items: [
      // This would have equipment-focused items
      // To be filled in with specific equipment items
    ]
  },
  
  // Resource-focused pool for materials
  resourcePrayer: {
    id: 'resourcePrayer',
    name: 'Bounties of the Bleak',
    description: 'Beseech the spirits of the land for materials and resources.',
    requiredResource: 'echoes',
    singlePullCost: 1,
    tenPullCost: 9,
    guaranteedRarityAtPity: RARITY.UNCOMMON,
    pityCounter: 0,
    items: [
      // This would have resource-focused items
      // To be filled in with specific resource items
    ]
  }
};

/**
 * Selects a random item from a weighted list
 * @param {Array} items - Array of items with weight property
 * @param {Object} adjustments - Optional weight adjustments by rarity
 * @returns {Object} The selected item
 */
export const selectWeightedRandom = (items, adjustments = {}) => {
  // Calculate total weight
  let totalWeight = 0;
  const adjustedItems = items.map(item => {
    let adjustedWeight = item.weight;
    
    // Apply any rarity adjustments
    if (adjustments[item.rarity]) {
      adjustedWeight += adjustments[item.rarity];
    }
    
    totalWeight += adjustedWeight;
    return {
      ...item,
      adjustedWeight
    };
  });
  
  // Random selection based on weight
  let random = Math.random() * totalWeight;
  let currentWeight = 0;
  
  for (const item of adjustedItems) {
    currentWeight += item.adjustedWeight;
    if (random <= currentWeight) {
      return item;
    }
  }
  
  // Fallback to last item (should never happen if weights are positive)
  return adjustedItems[adjustedItems.length - 1];
};

/**
 * Gets all items from a pool with rarity above or equal to minRarity
 * @param {Array} items - Array of items with rarity property
 * @param {String} minRarity - Minimum rarity to include
 * @returns {Array} Filtered items
 */
export const getItemsByMinRarity = (items, minRarity) => {
  const rarityValues = Object.values(RARITY);
  const minRarityIndex = rarityValues.indexOf(minRarity);
  
  if (minRarityIndex === -1) return items;
  
  return items.filter(item => {
    const itemRarityIndex = rarityValues.indexOf(item.rarity);
    return itemRarityIndex >= minRarityIndex;
  });
};

/**
 * Calculate pity adjustments based on counter value
 * @param {String} poolId - The gacha pool ID
 * @param {Number} pityCounter - Current pity counter value
 * @returns {Object} Weight adjustments by rarity
 */
export const calculatePityAdjustments = (poolId, pityCounter) => {
  const adjustments = {};
  const poolType = poolId.includes('equipment') ? 'equipmentPull' : 'standardPull';
  
  if (!PITY_ADJUSTMENTS[poolType]) return adjustments;
  
  // Apply adjustments based on pity counter
  Object.entries(PITY_ADJUSTMENTS[poolType]).forEach(([rarity, config]) => {
    if (pityCounter >= config.minPulls) {
      // Calculate how many pulls over the minimum
      const pullsOver = pityCounter - config.minPulls + 1;
      // Apply adjustment with diminishing returns
      adjustments[rarity] = config.adjustment * pullsOver;
    }
  });
  
  return adjustments;
};

export default {
  gachaPools,
  selectWeightedRandom,
  getItemsByMinRarity,
  calculatePityAdjustments,
  RARITY
};