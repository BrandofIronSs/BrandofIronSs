// Task definitions and utility functions for the quest system

// Task types
export const TASK_TYPES = {
  EXPLORE_AREA: 'EXPLORE_AREA',         // Visit areas in the Bleak Expanse
  CRAFT_ITEM_TYPE: 'CRAFT_ITEM_TYPE',   // Craft items of a specific type
  GATHER_RESOURCE: 'GATHER_RESOURCE',   // Gather core resources or stash items
  LEVEL_UP_MERC: 'LEVEL_UP_MERC',       // Level up mercenaries
  PERFORM_RITUAL: 'PERFORM_RITUAL'      // Perform rituals at the Altar
};

// Task definitions - will be referenced by id
export const taskDefinitions = [
  // Exploration Tasks
  {
    id: 'explore_woods_1',
    title: "Whispers from the Wailing Woods",
    description: "The ancient trees keen with forgotten sorrows. Venture forth and return, if your sanity holds.",
    type: TASK_TYPES.EXPLORE_AREA,
    target: { 
      areaId: 'whispering_woods', 
      count: 1 
    },
    rewards: {
      gold: 100,
      echoes: 5,
      items: [
        { itemId: 'minor_healing_potion', quantity: 2 }
      ],
      vitaeEssence: 50
    },
    isRepeatable: false,
    unlockedByDefault: true
  },

  // Crafting Tasks
  {
    id: 'craft_weapon_1',
    title: "Forging of the Forsaken",
    description: "The darkness hungers for flesh. Craft a weapon to carve your defiance into the void.",
    type: TASK_TYPES.CRAFT_ITEM_TYPE,
    target: { 
      itemType: 'Weapon', 
      count: 1 
    },
    rewards: {
      gold: 50,
      echoes: 3,
      items: [
        { itemId: 'steel_ingot', quantity: 5 }
      ]
    },
    isRepeatable: false,
    unlockedByDefault: true
  },

  // Resource Gathering Tasks
  {
    id: 'collect_vitae_1',
    title: "Lifeblood for the Hungry Dark",
    description: "The Bleeding Heart thirsts eternally. Feed it the crimson essence that sustains our sanctuary.",
    type: TASK_TYPES.GATHER_RESOURCE,
    target: { 
      resourceId: 'vitaeEssence', 
      amount: 50 
    },
    rewards: {
      gold: 75,
      behelitShard: 2,
      items: [
        { itemId: 'magic_crystal', quantity: 3 }
      ]
    },
    isRepeatable: false,
    unlockedByDefault: true
  },
  
  {
    id: 'collect_iron_ore_1',
    title: "Raw Materials",
    description: "Gather iron ore for crafting weapons and armor.",
    type: TASK_TYPES.GATHER_RESOURCE,
    target: { 
      itemId: 'iron_ore', 
      amount: 50 
    },
    rewards: {
      gold: 60,
      items: [
        { itemId: 'steel_ingot', quantity: 3 }
      ]
    },
    isRepeatable: false,
    unlockedByDefault: true
  },
  
  // Mercenary Tasks
  {
    id: 'level_merc_1',
    title: "Train Your Forces",
    description: "Strengthen your followers by training a mercenary to level 2.",
    type: TASK_TYPES.LEVEL_UP_MERC,
    target: { 
      level: 2, 
      count: 1 
    },
    rewards: {
      gold: 120,
      echoes: 4,
      items: [
        { itemId: 'iron_bracers', quantity: 1 }
      ]
    },
    isRepeatable: false,
    unlockedByDefault: true
  },
  
  // Ritual Tasks
  {
    id: 'perform_ritual_1',
    title: "Blood and Power",
    description: "Perform a ritual at The Bleeding Heart to gain its favor.",
    type: TASK_TYPES.PERFORM_RITUAL,
    target: { 
      ritualLocation: 'The Bleeding Heart', 
      count: 1 
    },
    rewards: {
      gold: 150,
      behelitShard: 3,
      vitaeEssence: 75
    },
    isRepeatable: false,
    unlockedByDefault: true,
    prerequisites: []
  }
];

// Utility functions

/**
 * Gets a task definition by its ID
 * @param {string} taskId - The ID of the task to retrieve
 * @returns {object|null} - The task definition or null if not found
 */
export const getTaskById = (taskId) => {
  return taskDefinitions.find(task => task.id === taskId) || null;
};

/**
 * Gets all unlocked tasks that should be available to the player
 * @param {object} completedTaskIds - Object with task IDs as keys for tasks that have been completed
 * @returns {array} - Array of unlocked task definitions
 */
export const getUnlockedTasks = (completedTaskIds = {}) => {
  return taskDefinitions.filter(task => {
    // If task is repeatable or hasn't been completed, and is either unlocked by default or prerequisites are met
    const isCompleted = completedTaskIds[task.id];
    return (task.isRepeatable || !isCompleted) && 
           (task.unlockedByDefault || arePrerequisitesMet(task, completedTaskIds));
  });
};

/**
 * Checks if all prerequisites for a task are met
 * @param {object} task - The task to check
 * @param {object} completedTaskIds - Object with task IDs as keys for tasks that have been completed
 * @returns {boolean} - Whether all prerequisites are met
 */
const arePrerequisitesMet = (task, completedTaskIds) => {
  if (!task.prerequisites || task.prerequisites.length === 0) {
    return true;
  }
  
  return task.prerequisites.every(prereqId => completedTaskIds[prereqId]);
}; 