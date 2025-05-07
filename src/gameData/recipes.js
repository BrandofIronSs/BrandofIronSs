// Recipe definitions for the Iron Forge

// Recipe definitions - will be referenced by id
export const recipeDefinitions = [
  // Basic Materials
  {
    id: 'recipe_steel_ingot',
    productItemId: 'steel_ingot',
    materials: [
      { itemId: 'iron_ore', quantity: 2 }
    ],
    craftingTime: 15,
    successRate: 0.9,
    qualityProbabilities: { crude: 0.2, common: 0.6, sturdy: 0.2 },
    unlocked: true,
    requiredForgeLevel: 0
  },
  
  // Weapons
  {
    id: 'recipe_rusty_dagger',
    productItemId: 'rusty_dagger',
    materials: [
      { itemId: 'iron_ore', quantity: 10 },
      { itemId: 'wood', quantity: 5 }
    ],
    craftingTime: 30,
    successRate: 0.85,
    qualityProbabilities: { crude: 0.25, common: 0.65, sturdy: 0.1 },
    unlocked: true,
    requiredForgeLevel: 0
  },
  {
    id: 'recipe_iron_sword',
    productItemId: 'iron_sword',
    materials: [
      { itemId: 'steel_ingot', quantity: 3 },
      { itemId: 'wood', quantity: 8 }
    ],
    craftingTime: 60,
    successRate: 0.8,
    qualityProbabilities: { crude: 0.2, common: 0.6, sturdy: 0.2 },
    unlocked: true,
    requiredForgeLevel: 1
  },
  
  // Armor
  {
    id: 'recipe_leather_armor',
    productItemId: 'leather_armor',
    materials: [
      { itemId: 'leather', quantity: 15 },
      { itemId: 'iron_ore', quantity: 5 }
    ],
    craftingTime: 45,
    successRate: 0.9,
    qualityProbabilities: { crude: 0.2, common: 0.7, sturdy: 0.1 },
    unlocked: true,
    requiredForgeLevel: 0
  },
  {
    id: 'recipe_iron_helmet',
    productItemId: 'iron_helmet',
    materials: [
      { itemId: 'steel_ingot', quantity: 2 },
      { itemId: 'leather', quantity: 5 }
    ],
    craftingTime: 40,
    successRate: 0.85,
    qualityProbabilities: { crude: 0.2, common: 0.65, sturdy: 0.15 },
    unlocked: true,
    requiredForgeLevel: 1
  }
];

// Helper function to find a recipe by ID
export const getRecipeById = (recipeId) => {
  return recipeDefinitions.find(recipe => recipe.id === recipeId) || null;
};

// Utility function to determine a quality outcome based on probability distribution
export const determineQuality = (qualityProbabilities) => {
  const random = Math.random();
  let cumulativeProbability = 0;
  
  // Sort qualities by their associated probabilities (optional, but makes it more deterministic)
  const sortedQualities = Object.entries(qualityProbabilities).sort((a, b) => a[1] - b[1]);
  
  // Find the quality whose cumulative probability range contains our random number
  for (const [quality, probability] of sortedQualities) {
    cumulativeProbability += probability;
    if (random <= cumulativeProbability) {
      return quality;
    }
  }
  
  // Default case (should rarely happen, only if probabilities don't sum to 1)
  return Object.keys(qualityProbabilities)[0];
}; 