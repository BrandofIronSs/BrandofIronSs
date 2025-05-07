// Synthesis/Transmutation recipes for the Altar of Binding

export const synthesisRecipeDefinitions = [
  // Core resource transmutation recipes
  {
    id: 'synth_steel_ingot',
    product: {
      itemId: 'steel_ingot',
      quantity: 1
    },
    materials: [
      { itemId: 'iron_ore', quantity: 2 }
    ],
    processingTime: 15,
    unlocked: true
  },
  {
    id: 'synth_leather',
    product: {
      itemId: 'leather',
      quantity: 1
    },
    materials: [
      { itemId: 'ruined_hide', quantity: 1 }
    ],
    processingTime: 20,
    unlocked: true
  },
  {
    id: 'synth_echoes_from_crystal',
    product: {
      resourceId: 'echoes',
      quantity: 5
    },
    materials: [
      { itemId: 'magic_crystal', quantity: 1 }
    ],
    processingTime: 30,
    unlocked: true
  },
  {
    id: 'synth_echoes_from_berserkboi',
    product: {
      resourceId: 'echoes',
      quantity: 2
    },
    materials: [
      { resourceId: 'berserkBoiCurrency', quantity: 10 }
    ],
    processingTime: 25,
    unlocked: true
  },
  {
    id: 'synth_minor_sanity_potion',
    product: {
      itemId: 'minor_sanity_potion',
      quantity: 1
    },
    materials: [
      { itemId: 'herbs', quantity: 5 },
      { resourceId: 'vitae_essence', quantity: 10 }
    ],
    processingTime: 45,
    unlocked: true
  }
];

// Helper function to find a synthesis recipe by ID
export const getSynthesisRecipeById = (recipeId) => {
  return synthesisRecipeDefinitions.find(recipe => recipe.id === recipeId) || null;
}; 