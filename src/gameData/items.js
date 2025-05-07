// Items data and utility functions for creating item instances

// Base item definitions - will be referenced by id
export const itemDefinitions = [
  // Base materials
  {
    id: 'iron_ore',
    name: 'Iron Ore',
    description: 'Raw iron ore mined from the depths.',
    icon: '⛏️',
    type: 'Material',
    stackable: true,
    maxStack: 999,
    value: 5
  },
  {
    id: 'steel_ingot',
    name: 'Steel Ingot',
    description: 'Refined steel, ready for forging.',
    icon: '🧱',
    type: 'Material',
    stackable: true,
    maxStack: 999,
    value: 15
  },
  {
    id: 'leather',
    name: 'Leather',
    description: 'Tanned hide, useful for armor and accessories.',
    icon: '🧶',
    type: 'Material',
    stackable: true,
    maxStack: 999,
    value: 8
  },
  {
    id: 'wood',
    name: 'Wood',
    description: 'Sturdy wood, good for handles and structures.',
    icon: '🪵',
    type: 'Material',
    stackable: true,
    maxStack: 999,
    value: 3
  },
  {
    id: 'magic_crystal',
    name: 'Magic Crystal',
    description: 'A mystical crystal that resonates with arcane energy.',
    icon: '💎',
    type: 'Material',
    stackable: true,
    maxStack: 99,
    value: 25
  },
  {
    id: 'ruined_hide',
    name: 'Ruined Hide',
    description: 'A damaged animal hide that can be processed into leather.',
    icon: '🥩',
    type: 'Material',
    stackable: true,
    maxStack: 99,
    value: 4
  },
  {
    id: 'herbs',
    name: 'Herbs',
    description: 'Various herbs with medicinal and alchemical properties.',
    icon: '🌿',
    type: 'Material',
    stackable: true,
    maxStack: 999,
    value: 3
  },
  
  // Weapons - At least 3 basic types
  {
    id: 'worn_dagger',
    name: 'Worn Dagger',
    description: 'An old dagger with a dull edge. Barely functional but still better than fists.',
    icon: '🗡️',
    type: 'Weapon',
    subType: 'Dagger',
    stackable: false,
    quality: 'Crude',
    stats: {
      strength: { base: 1 },
      agility: { base: 1 }
    },
    combatStats: {
      physicalAttack: 2,
      accuracy: 4,
      critChance: 6
    },
    value: 15
  },
  {
    id: 'rusty_dagger',
    name: 'Rusty Dagger',
    description: 'A simple dagger with a rusty blade. Not very effective, but better than nothing.',
    icon: '🗡️',
    type: 'Weapon',
    subType: 'Dagger',
    stackable: false,
    quality: 'Common',
    stats: {
      strength: { base: 2 },
      agility: { base: 1 }
    },
    combatStats: {
      physicalAttack: 3,
      accuracy: 5,
      critChance: 8
    },
    value: 25
  },
  {
    id: 'iron_sword',
    name: 'Iron Sword',
    description: 'A standard iron sword. Reliable if unexceptional.',
    icon: '⚔️',
    type: 'Weapon',
    subType: 'Sword',
    stackable: false,
    quality: 'Common',
    stats: {
      strength: { base: 5 },
      agility: { base: 2 }
    },
    combatStats: {
      physicalAttack: 5,
      accuracy: 3,
      critChance: 5
    },
    value: 50
  },
  {
    id: 'crude_axe',
    name: 'Crude Axe',
    description: 'A heavy axe with a rough edge. Slow but powerful.',
    icon: '🪓',
    type: 'Weapon',
    subType: 'Axe',
    stackable: false,
    quality: 'Common',
    stats: {
      strength: { base: 6 },
      agility: { base: -1 }
    },
    combatStats: {
      physicalAttack: 7,
      accuracy: 1,
      critChance: 3
    },
    value: 40
  },
  
  // Armor - At least 3 basic types
  {
    id: 'leather_armor',
    name: 'Leather Armor',
    description: 'Basic protective gear made from tanned hides.',
    icon: '🥋',
    type: 'Armor',
    subType: 'Chest',
    stackable: false,
    quality: 'Common',
    stats: {
      defense: { base: 3 },
      agility: { base: 1 }
    },
    combatStats: {
      physicalDefense: 4,
      evasion: 2
    },
    value: 40
  },
  {
    id: 'iron_helmet',
    name: 'Iron Helmet',
    description: 'A basic iron helmet that offers decent protection.',
    icon: '⛑️',
    type: 'Armor',
    subType: 'Head',
    stackable: false,
    quality: 'Common',
    stats: {
      defense: { base: 4 }
    },
    combatStats: {
      physicalDefense: 3,
      evasion: 0
    },
    value: 35
  },
  {
    id: 'tattered_rags',
    name: 'Tattered Rags',
    description: 'Worn and dirty clothing offering minimal protection but better than nothing.',
    icon: '👕',
    type: 'Armor',
    subType: 'Chest',
    stackable: false,
    quality: 'Crude',
    stats: {
      defense: { base: 1 },
      agility: { base: 2 }
    },
    combatStats: {
      physicalDefense: 1,
      evasion: 3
    },
    value: 15
  },
  
  // Accessories - Adding 3 basic types
  {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    description: 'A small trinket that seems to bring good fortune to its bearer.',
    icon: '🍀',
    type: 'Accessory',
    subType: 'Trinket',
    stackable: false,
    quality: 'Common',
    stats: {
      willpower: { base: 2 }
    },
    combatStats: {
      critChance: 5,
      evasion: 2
    },
    value: 30
  },
  {
    id: 'iron_bracers',
    name: 'Iron Bracers',
    description: 'Simple metal bracers that protect the forearms.',
    icon: '⚓',
    type: 'Accessory',
    subType: 'Bracers',
    stackable: false,
    quality: 'Common',
    stats: {
      strength: { base: 1 },
      defense: { base: 2 }
    },
    combatStats: {
      physicalDefense: 2,
      physicalAttack: 1
    },
    value: 25
  },
  {
    id: 'bone_necklace',
    name: 'Bone Necklace',
    description: 'A crude necklace made from small animal bones. Has an unsettling aura.',
    icon: '📿',
    type: 'Accessory',
    subType: 'Necklace',
    stackable: false,
    quality: 'Common',
    stats: {
      willpower: { base: 3 },
      agility: { base: -1 }
    },
    combatStats: {
      physicalAttack: 2,
      accuracy: 1
    },
    value: 35
  },
  
  // Consumables
  {
    id: 'minor_sanity_potion',
    name: 'Minor Sanity Potion',
    description: 'A mysterious concoction that stabilizes the mind.',
    icon: '🧪',
    type: 'Consumable',
    stackable: true,
    maxStack: 10,
    value: 50,
    effect: {
      type: 'restore_sanity',
      amount: 15
    }
  },
  {
    id: 'minor_healing_salve',
    name: 'Minor Healing Salve',
    description: 'A basic herbal remedy that soothes wounds.',
    icon: '🧪',
    type: 'Consumable',
    stackable: true,
    maxStack: 10,
    value: 40,
    effect: {
      type: 'restore_health',
      amount: 20
    }
  },
  {
    id: 'blood_vial',
    name: 'Blood Vial',
    description: 'A small vial of mysterious blood with restorative properties.',
    icon: '🧪',
    type: 'Consumable',
    stackable: true,
    maxStack: 5,
    value: 75,
    effect: {
      type: 'restore_health',
      amount: 30
    }
  },
  
  // More Weapons
  {
    id: 'militia_sword',
    name: 'Militia Sword',
    description: 'A standard issue sword for local defense forces. Reliable and simple.',
    icon: '⚔️',
    type: 'Weapon',
    subType: 'Sword',
    stackable: false,
    quality: 'Common',
    stats: {
      strength: { base: 3 },
      agility: { base: 1 }
    },
    combatStats: {
      physicalAttack: 4,
      accuracy: 3,
      critChance: 4
    },
    value: 45
  },
  
  // More Armor
  {
    id: 'tattered_armor',
    name: 'Tattered Armor',
    description: 'A worn set of leather armor with multiple patches and tears.',
    icon: '🥋',
    type: 'Armor',
    subType: 'Chest',
    stackable: false,
    quality: 'Crude',
    stats: {
      defense: { base: 2 },
      agility: { base: 1 }
    },
    combatStats: {
      physicalDefense: 2,
      evasion: 2
    },
    value: 25
  },
  
  // More Materials
  {
    id: 'iron_scraps',
    name: 'Iron Scraps',
    description: 'Miscellaneous iron fragments and bent nails. Can be melted down for crafting.',
    icon: '⛏️',
    type: 'Material',
    stackable: true,
    maxStack: 99,
    value: 3
  },
  
  // Recipe Scrolls
  {
    id: 'recipe_scroll_basic',
    name: 'Basic Recipe Scroll',
    description: 'A worn parchment containing instructions for a basic crafting recipe.',
    icon: '📜',
    type: 'Recipe',
    stackable: true,
    maxStack: 5,
    value: 100
  },
  {
    id: 'recipe_scroll_advanced',
    name: 'Advanced Recipe Scroll',
    description: 'A well-preserved parchment containing rare crafting knowledge.',
    icon: '📜',
    type: 'Recipe',
    stackable: true,
    maxStack: 5,
    value: 250
  },
  
  // More Consumables
  {
    id: 'lesser_health_vial',
    name: 'Lesser Health Vial',
    description: 'A small vial containing red liquid that promotes rapid healing.',
    icon: '❤️',
    type: 'Consumable',
    stackable: true,
    maxStack: 10,
    value: 40,
    effect: {
      type: 'restore_health',
      amount: 25
    }
  },
  {
    id: 'rations_pack',
    name: 'Rations Pack',
    description: 'Preserved food that provides sustenance during long expeditions.',
    icon: '🍖',
    type: 'Consumable',
    stackable: true,
    maxStack: 20,
    value: 20,
    effect: {
      type: 'restore_health',
      amount: 10,
      duration: 300
    }
  },
  {
    id: 'sharpening_stone',
    name: 'Sharpening Stone',
    description: 'A rough stone used to temporarily improve weapon effectiveness.',
    icon: '🧱',
    type: 'Consumable',
    stackable: true,
    maxStack: 5,
    value: 30,
    effect: {
      type: 'buff_attack',
      amount: 5,
      duration: 600
    }
  },
  {
    id: 'antidote_vial',
    name: 'Antidote Vial',
    description: 'A bitter medicinal liquid that neutralizes poisons and toxins.',
    icon: '💉',
    type: 'Consumable',
    stackable: true,
    maxStack: 5,
    value: 45,
    effect: {
      type: 'cure_status',
      status: 'poisoned'
    }
  },
  
  // More Materials
  {
    id: 'simple_thread',
    name: 'Simple Thread',
    description: 'Common thread spun from plant fibers, used in basic crafting.',
    icon: '🧵',
    type: 'Material',
    stackable: true,
    maxStack: 999,
    value: 2
  },
  {
    id: 'iron_nail',
    name: 'Iron Nail',
    description: 'Basic iron nails used in various constructions and crafting.',
    icon: '📌',
    type: 'Material',
    stackable: true,
    maxStack: 999,
    value: 1
  },
  
  // More Weapons
  {
    id: 'worn_shortsword',
    name: 'Worn Shortsword',
    description: 'A well-used shortsword with multiple nicks in the blade.',
    icon: '⚔️',
    type: 'Weapon',
    subType: 'Sword',
    stackable: false,
    quality: 'Crude',
    stats: {
      strength: { base: 3 },
      agility: { base: 2 }
    },
    combatStats: {
      physicalAttack: 3,
      accuracy: 4,
      critChance: 5
    },
    value: 30
  },
  {
    id: 'simple_club',
    name: 'Simple Club',
    description: 'A heavy wooden club. Crude but effective.',
    icon: '🏏',
    type: 'Weapon',
    subType: 'Bludgeon',
    stackable: false,
    quality: 'Crude',
    stats: {
      strength: { base: 4 },
      agility: { base: -1 }
    },
    combatStats: {
      physicalAttack: 4,
      accuracy: 2,
      critChance: 2
    },
    value: 20
  },
  
  // More Armor
  {
    id: 'padded_gambeson',
    name: 'Padded Gambeson',
    description: 'A simple padded jacket worn under armor or as light protection.',
    icon: '🧥',
    type: 'Armor',
    subType: 'Chest',
    stackable: false,
    quality: 'Common',
    stats: {
      defense: { base: 2 },
      agility: { base: 0 }
    },
    combatStats: {
      physicalDefense: 3,
      evasion: 1
    },
    value: 30
  },
  {
    id: 'leather_gloves',
    name: 'Leather Gloves',
    description: 'Simple leather gloves that protect the hands and improve grip.',
    icon: '🧤',
    type: 'Armor',
    subType: 'Hands',
    stackable: false,
    quality: 'Common',
    stats: {
      defense: { base: 1 },
      agility: { base: 2 }
    },
    combatStats: {
      physicalDefense: 1,
      accuracy: 2
    },
    value: 25
  },
  {
    id: 'cracked_round_shield',
    name: 'Cracked Round Shield',
    description: 'A wooden shield with a metal rim. Has seen better days.',
    icon: '🛡️',
    type: 'Armor',
    subType: 'Shield',
    stackable: false,
    quality: 'Crude',
    stats: {
      defense: { base: 3 },
      agility: { base: -1 }
    },
    combatStats: {
      physicalDefense: 4,
      evasion: -1
    },
    value: 35
  },
  
  // More Accessories
  {
    id: 'simple_amulet',
    name: 'Simple Amulet',
    description: 'A plain amulet carved from bone with minimal inscriptions.',
    icon: '📿',
    type: 'Accessory',
    subType: 'Necklace',
    stackable: false,
    quality: 'Common',
    stats: {
      willpower: { base: 2 }
    },
    combatStats: {
      accuracy: 1,
      critChance: 1
    },
    value: 30
  },
  {
    id: 'leather_belt',
    name: 'Leather Belt',
    description: 'A sturdy leather belt with a simple iron buckle.',
    icon: '⚒️',
    type: 'Accessory',
    subType: 'Belt',
    stackable: false,
    quality: 'Common',
    stats: {
      strength: { base: 1 }
    },
    combatStats: {
      physicalAttack: 1
    },
    value: 20
  }
];

// Quality modifiers for stats
const qualityModifiers = {
  crude: 0.8,   // 80% of base stats
  common: 1.0,  // 100% of base stats (reference level)
  sturdy: 1.2,  // 120% of base stats
  quality: 1.5, // 150% of base stats
  masterwork: 2.0 // 200% of base stats
};

// Function to generate a unique ID for item instances
const generateInstanceId = () => {
  return `item_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
};

// Function to adjust stats based on quality
const adjustStatsForQuality = (baseStats, quality) => {
  if (!baseStats) return {};
  
  const modifier = qualityModifiers[quality.toLowerCase()] || 1.0;
  const adjustedStats = {};
  
  Object.keys(baseStats).forEach(statKey => {
    adjustedStats[statKey] = {
      ...baseStats[statKey],
      base: Math.round((baseStats[statKey].base * modifier) * 10) / 10 // Round to 1 decimal place
    };
  });
  
  return adjustedStats;
};

// Function to adjust combat stats based on quality
const adjustCombatStatsForQuality = (combatStats, quality) => {
  if (!combatStats) return {};
  
  const modifier = qualityModifiers[quality.toLowerCase()] || 1.0;
  const adjustedCombatStats = {};
  
  Object.keys(combatStats).forEach(statKey => {
    // Round to whole numbers for most combat stats
    adjustedCombatStats[statKey] = Math.round(combatStats[statKey] * modifier);
  });
  
  return adjustedCombatStats;
};

// Main function to create an item instance with quality
export const createItemInstance = (itemId, quality = 'Common') => {
  // Find the base item definition
  const itemDef = itemDefinitions.find(item => item.id === itemId);
  
  if (!itemDef) {
    console.error(`Item definition not found for ID: ${itemId}`);
    return null;
  }
  
  // For stackable items (like materials), just return a basic instance
  if (itemDef.stackable) {
    return {
      id: itemDef.id,
      name: itemDef.name,
      description: itemDef.description,
      icon: itemDef.icon,
      type: itemDef.type,
      stackable: true,
      maxStack: itemDef.maxStack,
      quantity: 1, // Default quantity
      value: itemDef.value
    };
  }
  
  // For non-stackable items (like equipment), create a unique instance with quality
  return {
    id: itemDef.id,
    instanceId: generateInstanceId(),
    name: itemDef.name,
    description: itemDef.description,
    icon: itemDef.icon,
    type: itemDef.type,
    subType: itemDef.subType,
    stackable: false,
    quality: quality,
    stats: adjustStatsForQuality(itemDef.stats, quality),
    combatStats: adjustCombatStatsForQuality(itemDef.combatStats, quality),
    value: Math.round(itemDef.value * (qualityModifiers[quality.toLowerCase()] || 1.0))
  };
};

// Helper function to get an item definition by ID
export const getItemDefinition = (itemId) => {
  if (!itemId) {
    console.error('getItemDefinition called with empty itemId');
    return null;
  }
  
  // Normalize the ID before lookup (this helps with potential case mismatches)
  const normalizedId = itemId.toLowerCase().trim();
  
  // Debug log to see what we're looking for
  console.log(`Looking up item definition for "${itemId}" (normalized: "${normalizedId}")`);
  console.log(`Available items: ${itemDefinitions.map(item => item.id).join(', ')}`);
  
  const item = itemDefinitions.find(item => item.id.toLowerCase() === normalizedId);
  
  if (!item) {
    console.error(`Item definition not found for ID: ${itemId}`);
    // Attempt to find a partial match
    const similarItems = itemDefinitions.filter(item => 
      item.id.includes(normalizedId) || normalizedId.includes(item.id)
    );
    if (similarItems.length > 0) {
      console.log(`Similar items found: ${similarItems.map(item => item.id).join(', ')}`);
    }
    return null;
  }
  
  return item;
}; 