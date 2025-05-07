// Shop items data definition for The Pauper's Hand
// This file defines which items from items.js are sold in the shop
// and their shop-specific properties

// Main export - the shop's inventory
export const shopItemDefinitions = [
  // ==================== CONSUMABLES ====================
  {
    shopListingId: 'buy_msp_single',
    itemId: 'minor_sanity_potion',
    quantitySold: 1,
    priceGold: 75,
    stock: { 
      current: 5, 
      max: 5,
      refreshes: 'daily' 
    },
    category: 'Consumables'
  },
  {
    shopListingId: 'buy_lesser_health_vial',
    itemId: 'lesser_health_vial',
    quantitySold: 1,
    priceGold: 60,
    stock: { 
      current: 5, 
      max: 5,
      refreshes: 'daily' 
    },
    category: 'Consumables'
  },
  {
    shopListingId: 'buy_rations_pack',
    itemId: 'rations_pack',
    quantitySold: 1,
    priceGold: 30,
    stock: { 
      current: 8, 
      max: 8,
      refreshes: 'daily' 
    },
    category: 'Consumables'
  },
  {
    shopListingId: 'buy_sharpening_stone',
    itemId: 'sharpening_stone',
    quantitySold: 1,
    priceGold: 45,
    stock: { 
      current: 3, 
      max: 3,
      refreshes: 'daily' 
    },
    category: 'Consumables'
  },
  {
    shopListingId: 'buy_antidote_vial',
    itemId: 'antidote_vial',
    quantitySold: 1,
    priceGold: 65,
    stock: { 
      current: 3, 
      max: 3,
      refreshes: 'daily' 
    },
    category: 'Consumables'
  },
  {
    shopListingId: 'buy_minor_healing_salve',
    itemId: 'minor_healing_salve',
    quantitySold: 1,
    priceGold: 55,
    stock: { 
      current: 4, 
      max: 4,
      refreshes: 'daily' 
    },
    category: 'Consumables'
  },
  
  // ==================== MATERIALS ====================
  {
    shopListingId: 'buy_iron_bundle',
    itemId: 'iron_ore',
    quantitySold: 20,
    priceGold: 50,
    stock: { 
      current: Infinity 
    },
    overrideName: 'Iron Ore Bundle',
    overrideDescription: 'A modest bundle of iron ore. Essential for basic crafting and forging.',
    category: 'Materials'
  },
  {
    shopListingId: 'buy_wood_bundle',
    itemId: 'wood',
    quantitySold: 20,
    priceGold: 50,
    stock: { 
      current: Infinity 
    },
    overrideName: 'Wood Bundle',
    overrideDescription: 'A collection of sturdy wood pieces, useful for crafting and construction.',
    category: 'Materials'
  },
  {
    shopListingId: 'buy_leather_bundle',
    itemId: 'leather',
    quantitySold: 10,
    priceGold: 65,
    stock: { 
      current: 8,
      max: 8,
      refreshes: 'daily'
    },
    overrideName: 'Leather Bundle',
    overrideDescription: 'A small bundle of processed leather. Used in crafting armor and accessories.',
    category: 'Materials'
  },
  {
    shopListingId: 'buy_herbs_bundle',
    itemId: 'herbs',
    quantitySold: 15,
    priceGold: 40,
    stock: { 
      current: 10,
      max: 10,
      refreshes: 'daily'
    },
    overrideName: 'Herb Collection',
    overrideDescription: 'An assortment of common herbs with various medicinal properties.',
    category: 'Materials'
  },
  {
    shopListingId: 'buy_magic_crystal',
    itemId: 'magic_crystal',
    quantitySold: 1,
    priceGold: 120,
    stock: { 
      current: 3,
      max: 3,
      refreshes: 'daily'
    },
    category: 'Materials'
  },
  {
    shopListingId: 'buy_simple_thread',
    itemId: 'simple_thread',
    quantitySold: 30,
    priceGold: 30,
    stock: {
      current: Infinity
    },
    overrideName: 'Thread Bundle',
    overrideDescription: 'A bundle of basic thread, ideal for simple repairs and crafting projects.',
    category: 'Materials'
  },
  {
    shopListingId: 'buy_iron_nails',
    itemId: 'iron_nail',
    quantitySold: 50,
    priceGold: 25,
    stock: {
      current: Infinity
    },
    overrideName: 'Iron Nails (Box)',
    overrideDescription: 'A box of iron nails, essential for construction and basic crafting.',
    category: 'Materials'
  },
  {
    shopListingId: 'buy_ruined_hide',
    itemId: 'ruined_hide',
    quantitySold: 8,
    priceGold: 35,
    stock: {
      current: 6,
      max: 6,
      refreshes: 'daily'
    },
    overrideName: 'Ruined Hides',
    overrideDescription: 'A bundle of damaged animal hides. Can be processed into leather with some work.',
    category: 'Materials'
  },
  
  // ==================== EQUIPMENT ====================
  {
    shopListingId: 'buy_rusty_dagger',
    itemId: 'rusty_dagger',
    quantitySold: 1,
    priceGold: 35,
    stock: { 
      current: 2,
      max: 2,
      refreshes: 'daily'
    },
    category: 'Equipment'
  },
  {
    shopListingId: 'buy_tattered_rags',
    itemId: 'tattered_rags',
    quantitySold: 1,
    priceGold: 25,
    stock: { 
      current: 2,
      max: 2,
      refreshes: 'daily'
    },
    category: 'Equipment'
  },
  {
    shopListingId: 'buy_worn_shortsword',
    itemId: 'worn_shortsword',
    quantitySold: 1,
    priceGold: 45,
    stock: {
      current: 1,
      max: 1,
      refreshes: 'daily'
    },
    category: 'Equipment'
  },
  {
    shopListingId: 'buy_simple_club',
    itemId: 'simple_club',
    quantitySold: 1,
    priceGold: 30,
    stock: {
      current: 2,
      max: 2,
      refreshes: 'daily'
    },
    category: 'Equipment'
  },
  {
    shopListingId: 'buy_padded_gambeson',
    itemId: 'padded_gambeson',
    quantitySold: 1,
    priceGold: 40,
    stock: {
      current: 2,
      max: 2,
      refreshes: 'daily'
    },
    category: 'Equipment'
  },
  {
    shopListingId: 'buy_leather_gloves',
    itemId: 'leather_gloves',
    quantitySold: 1,
    priceGold: 35,
    stock: {
      current: 3,
      max: 3,
      refreshes: 'daily'
    },
    category: 'Equipment'
  },
  {
    shopListingId: 'buy_cracked_shield',
    itemId: 'cracked_round_shield',
    quantitySold: 1,
    priceGold: 50,
    stock: {
      current: 1,
      max: 1,
      refreshes: 'daily'
    },
    category: 'Equipment'
  },
  {
    shopListingId: 'buy_simple_amulet',
    itemId: 'simple_amulet',
    quantitySold: 1,
    priceGold: 45,
    stock: {
      current: 1,
      max: 1,
      refreshes: 'daily'
    },
    category: 'Equipment'
  },
  {
    shopListingId: 'buy_leather_belt',
    itemId: 'leather_belt',
    quantitySold: 1,
    priceGold: 30,
    stock: {
      current: 2,
      max: 2,
      refreshes: 'daily'
    },
    category: 'Equipment'
  }
];

// Helper function to find a shop listing by ID
export const getShopListingById = (shopListingId) => {
  return shopItemDefinitions.find(listing => listing.shopListingId === shopListingId);
}; 