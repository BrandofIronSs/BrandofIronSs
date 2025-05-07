// Market Listings Data
// This file contains market listings for the Wyrd Exchange

// Buyback rates by item type (used when selling items to the market)
export const MARKET_BUYBACK_RATES = {
  'Weapon': 0.4,     // 40% of base value for weapons
  'Armor': 0.45,     // 45% of base value for armor
  'Accessory': 0.5,  // 50% of base value for accessories
  'Material': 0.6,   // 60% of base value for materials
  'Consumable': 0.55, // 55% of base value for consumables
  'default': 0.5     // Default 50% rate for other item types
};

// Initial listings for the Wyrd Exchange market
export const initialMarketListings = [
  // Weapons
  {
    listingId: 'market_iron_sword',
    itemId: 'iron_sword',
    priceGold: 250,
    priceBerserkBoi: null,
    basePriceGold: 250,
    basePriceBerserkBoi: null,
    initialStock: 2,
    category: 'Equipment',
    sellerType: 'Wandering Merchant',
    quality: 'Common'
  },
  {
    listingId: 'market_steel_dagger',
    itemId: 'steel_dagger',
    priceGold: 180,
    priceBerserkBoi: null,
    basePriceGold: 180,
    basePriceBerserkBoi: null,
    initialStock: 1,
    category: 'Equipment',
    sellerType: 'Rogue Trader',
    quality: 'Sturdy'
  },
  {
    listingId: 'market_war_hammer',
    itemId: 'war_hammer',
    priceGold: 320,
    priceBerserkBoi: null,
    basePriceGold: 320,
    basePriceBerserkBoi: null,
    initialStock: 1,
    category: 'Equipment',
    sellerType: 'Weapon Smith',
    quality: 'Common'
  },

  // Armor
  {
    listingId: 'market_chainmail',
    itemId: 'chainmail',
    priceGold: 300,
    priceBerserkBoi: null,
    basePriceGold: 300,
    basePriceBerserkBoi: null,
    initialStock: 1,
    category: 'Equipment',
    sellerType: 'Armor Dealer',
    quality: 'Common'
  },
  {
    listingId: 'market_leather_boots',
    itemId: 'leather_boots',
    priceGold: 120,
    priceBerserkBoi: null,
    basePriceGold: 120,
    basePriceBerserkBoi: null,
    initialStock: 3,
    category: 'Equipment',
    sellerType: 'Leatherworker',
    quality: 'Common'
  },

  // Materials
  {
    listingId: 'market_magic_crystal',
    itemId: 'magic_crystal',
    priceGold: 75,
    priceBerserkBoi: null,
    basePriceGold: 75,
    basePriceBerserkBoi: null,
    initialStock: 5,
    category: 'Materials',
    sellerType: 'Mystic Peddler',
    quantity: 1
  },
  {
    listingId: 'market_steel_ingot',
    itemId: 'steel_ingot',
    priceGold: 60,
    priceBerserkBoi: null,
    basePriceGold: 60,
    basePriceBerserkBoi: null,
    initialStock: 8,
    category: 'Materials',
    sellerType: 'Blacksmith',
    quantity: 1
  },
  {
    listingId: 'market_rare_herbs',
    itemId: 'herbs',
    priceGold: 25,
    priceBerserkBoi: null,
    basePriceGold: 25,
    basePriceBerserkBoi: null,
    initialStock: 10,
    category: 'Materials',
    sellerType: 'Herbalist',
    quantity: 5
  },

  // Consumables
  {
    listingId: 'market_healing_potion',
    itemId: 'healing_potion',
    priceGold: 100,
    priceBerserkBoi: null,
    basePriceGold: 100,
    basePriceBerserkBoi: null,
    initialStock: 3,
    category: 'Consumables',
    sellerType: 'Alchemist',
    quantity: 1
  },
  {
    listingId: 'market_antidote',
    itemId: 'antidote',
    priceGold: 80,
    priceBerserkBoi: null,
    basePriceGold: 80,
    basePriceBerserkBoi: null,
    initialStock: 2,
    category: 'Consumables',
    sellerType: 'Alchemist',
    quantity: 1
  },

  // Special items (Berserk Boi currency)
  {
    listingId: 'market_enchanted_amulet',
    itemId: 'enchanted_amulet',
    priceGold: null,
    priceBerserkBoi: 10,
    basePriceGold: null,
    basePriceBerserkBoi: 10,
    initialStock: 1,
    category: 'Equipment',
    sellerType: 'Mysterious Stranger',
    quality: 'Quality'
  }
]; 